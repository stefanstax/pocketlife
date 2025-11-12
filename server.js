import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import multer from "multer";
import { supabase } from "./supabaseClient.js";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: process.env.VITE_WEB_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

import axios from "axios";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./src/app/middleware/authenticateToken.js";
import { current } from "@reduxjs/toolkit";

// Currencies
app.get("/currencies", authenticateToken, async (req, res) => {
  const userId = req.user?.userId;
  try {
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .eq("userId", userId);

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get(`/currencies/:id`, authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .eq("code", id)
      .single();

    if (error) return res.status(400).json({ message: error.message });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/currencies", authenticateToken, async (req, res) => {
  const newCurrency = { ...req.body, userId: req.user.userId };

  try {
    const { data: existing } = await supabase
      .from("currencies")
      .select("*")
      .eq("code", newCurrency.code);

    if (existing.length > 0)
      return res
        .status(400)
        .json({ message: "You've already created this currency." });

    const { data, error } = await supabase
      .from("currencies")
      .insert([newCurrency]);

    if (error) return res.status(400).json({ message: error.message });
    res.status(201).json({
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an issue inserting a new currency." });
  }
});

app.put("/currencies/:code", authenticateToken, async (req, res) => {
  const { code } = req.params;
  const updatedBody = { ...req.body, userId: req.user.userId };

  try {
    const { error } = await supabase
      .from("currencies")
      .update(updatedBody)
      .eq("code", code);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ message: "Currency has been updated." });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Unexpected server error.",
    });
  }
});

app.delete("/currencies/:code", authenticateToken, async (req, res) => {
  const { code } = req.params;
  try {
    const { error } = await supabase
      .from("currencies")
      .delete()
      .eq("code", code);

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json({ message: "Currency has been deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Users
app.get("/users", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", id)
      .single();

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  const { username, name, email, passcode, securityName, recoveryUrl } =
    req.body;

  const hashPasscode = await bcrypt.hash(passcode, 10);
  const newUserData = {
    username,
    email,
    name,
    passcode: hashPasscode,
    securityName,
    recoveryUrl,
  };

  try {
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing)
      return res.status(409).json({ message: "Email already taken." });

    const { data, error } = await supabase.from("users").insert([newUserData]);
    if (error) return res.status(400).json({ message: error.message });

    return res.status(201).json({ message: "User has been created." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updatedBody)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, passcode } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "User was not found." });
    }

    const isMatchPasscode = await bcrypt.compare(passcode, data.passcode);

    if (!isMatchPasscode) {
      return res
        .status(401)
        .json({ message: "Double check your credentials." });
    }

    const { passcode: _, ...user } = data;
    const token = jwt.sign(
      {
        userId: user?.id,
        email: user?.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/transactions", authenticateToken, async (req, res) => {
  const pageNum = parseInt(req.query.page || "1", 10);
  const limitNum = parseInt(req.query.limit || "10", 10);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum - 1;

  const userId = req.user.userId;

  try {
    const [currRes, payRes] = await Promise.all([
      supabase.from("currencies").select("*"),
      supabase.from("payment-methods").select("*").eq("userId", userId),
    ]);

    if (currRes.error || payRes.error) {
      return res.status(500).json({
        message: currRes.error?.message || payRes.error?.message,
      });
    }

    const currencies = currRes.data;
    const paymentMethods = payRes.data;

    const {
      data: transactions,
      error,
      count,
    } = await supabase
      .from("transactions")
      .select("*", { count: "exact" })
      .eq("userId", userId)
      .eq("context", "BUSINESS")
      .order("created_at", { ascending: false })
      .range(startIndex, endIndex);

    if (error) return res.status(500).json({ message: error.message });

    const enriched = transactions.map((tx) => {
      const currency = currencies.find((c) => c.code === tx.currencyId) || null;
      const paymentMethod =
        paymentMethods.find((p) => p.id === tx.paymentMethodId) || null;
      return {
        ...tx,
        currency,
        paymentMethod,
      };
    });

    return res.json({
      data: enriched,
      total: count,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

app.get("/transactions/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .eq("userId", userId)
      .select()
      .single();

    if (!data) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

// Transactions
app.post("/transactions", authenticateToken, async (req, res) => {
  const { budgetId, paymentMethodId, amount, type } = req.body;

  try {
    const { data: paymentMethod } = await supabase
      .from("payment-methods")
      .select("budgets")
      .eq("id", paymentMethodId)
      .single();

    const budgets = paymentMethod?.budgets || [];
    const findBudget = budgets.find((budget) => budget?.id === budgetId);

    if (findBudget) {
      if (type === "EXPENSE") {
        findBudget.amount -= amount;
        if (findBudget.amount < 0) {
          return res.status(400).json({
            message: "Insufficient budget amount. Feel free to top up.",
          });
        }
      } else if (type === "INCOME") {
        findBudget.amount += amount;
      } else {
        return res.status(400).json({ message: "Invalid transaction type." });
      }
    } else
      return res
        .status(400)
        .json({ message: "We couldn't locate payment method's budget." });

    const { error: updateError } = await supabase
      .from("payment-methods")
      .update({ budgets })
      .eq("id", paymentMethodId);

    if (updateError)
      return res.status(500).json({ message: updateError.message });

    const { data, error: insertError } = await supabase
      .from("transactions")
      .insert([req.body]);

    if (insertError)
      return res.status(400).json({ message: insertError.message });

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/transactions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;
  const { budgetId, paymentMethodId, type, amount } = updatedBody;

  try {
    const { data: paymentMethod } = await supabase
      .from("payment-methods")
      .select("budgets")
      .eq("id", paymentMethodId)
      .single();

    const budgets = paymentMethod?.budgets || [];
    const findBudget = budgets.find((budget) => budget?.id === budgetId);

    if (findBudget) {
      if (type === "EXPENSE") {
        findBudget.amount -= amount;
        if (findBudget.amount < 0) {
          return res.status(400).json({
            message: "Insufficient budget amount. Feel free to top up.",
          });
        }
      } else if (type === "INCOME") {
        findBudget.amount += amount;
      } else {
        return res.status(400).json({ message: "Invalid transaction type." });
      }
    } else
      return res
        .status(400)
        .json({ message: "We couldn't locate payment method's budget." });

    const { data: currentTransaction, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (txError || !currentTransaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const {
      amount: amountBeforeUpdate,
      type: typeBeforeUpdate,
      budgetId: budgetBeforeUpdate,
      paymentMethodId: paymentMethodBeforeUpdate,
    } = currentTransaction;

    const needsRecalculation =
      amountBeforeUpdate !== amount ||
      typeBeforeUpdate !== type ||
      budgetBeforeUpdate !== budgetId ||
      paymentMethodBeforeUpdate !== paymentMethodId;

    if (needsRecalculation) {
      const { data: newPaymentMethod, error: newPMError } = await supabase
        .from("payment-methods")
        .select("*")
        .eq("id", paymentMethodId)
        .single();

      if (newPMError || !newPaymentMethod) {
        return res
          .status(400)
          .json({ message: "New payment method not found." });
      }

      let oldPaymentMethod = newPaymentMethod;

      if (paymentMethodBeforeUpdate !== paymentMethodId) {
        const { data: oldPM, error: oldPMError } = await supabase
          .from("payment-methods")
          .select("*")
          .eq("id", paymentMethodBeforeUpdate)
          .single();

        if (oldPMError || !oldPM) {
          return res
            .status(400)
            .json({ message: "Old payment method not found." });
        }

        oldPaymentMethod = oldPM;
      }

      const oldBudgets = [...(oldPaymentMethod.budgets || [])];
      const toBeReconciledBudget = oldBudgets.find(
        (buget) => buget.id === budgetBeforeUpdate
      );

      if (toBeReconciledBudget) {
        if (typeBeforeUpdate === "EXPENSE") {
          toBeReconciledBudget.amount += amountBeforeUpdate;
        } else if (typeBeforeUpdate === "INCOME") {
          toBeReconciledBudget.amount -= amountBeforeUpdate;
        }
      }

      const newBudgets = [...(newPaymentMethod.budgets || [])];
      const targetBudget = newBudgets.find((b) => b.id === budgetId);

      if (!targetBudget) {
        return res
          .status(400)
          .json({ message: "Target budget not found in payment method." });
      }

      if (type === "EXPENSE") {
        targetBudget.amount -= amount;
        if (targetBudget.amount < 0) {
          return res
            .status(400)
            .json({ message: "Insufficient budget. Top up required." });
        }
      } else if (type === "INCOME") {
        targetBudget.amount += amount;
      } else {
        return res.status(400).json({ message: "Invalid transaction type." });
      }

      if (paymentMethodBeforeUpdate !== paymentMethodId) {
        const { error: updateOldError } = await supabase
          .from("payment-methods")
          .update({ budgets: oldBudgets })
          .eq("id", paymentMethodBeforeUpdate);

        if (updateOldError) {
          return res
            .status(400)
            .json({ message: "Failed to update old payment method budgets." });
        }
      }

      const { error: updateNewError } = await supabase
        .from("payment-methods")
        .update({ budgets: newBudgets })
        .eq("id", paymentMethodId);

      if (updateNewError) {
        return res
          .status(400)
          .json({ message: "Failed to update new payment method budgets." });
      }
    }

    const { data: updatedTx, error: updateTxError } = await supabase
      .from("transactions")
      .update(updatedBody)
      .eq("id", id)
      .select()
      .single();

    if (updateTxError) {
      return res.status(400).json({ message: updateTxError.message });
    }

    return res.status(200).json(updatedTx);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/transactions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: transaction } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    const { paymentMethodId, type, amount, budgetId } = transaction;

    const { data: paymentMethod } = await supabase
      .from("payment-methods")
      .select("budgets")
      .eq("id", paymentMethodId)
      .single();

    const budgets = paymentMethod?.budgets || [];
    const findBudget = budgets.find((budget) => budget?.id === budgetId);

    if (findBudget) {
      if (type === "EXPENSE") {
        findBudget.amount += amount;
      } else if (type === "INCOME") {
        findBudget.amount -= amount;
        if (findBudget.amount < 0) {
          return res
            .status(400)
            .json({ message: "Invalid budget state after reversal" });
        }
      } else {
        return res.status(400).json({ message: "Invalid transaction type" });
      }
    }

    await supabase
      .from("payment-methods")
      .update({ budgets })
      .eq("id", paymentMethodId);

    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error)
      return res
        .status(400)
        .json({ message: "Please double check delete parameters." });

    return res.status(200).json({ message: "Transaction has been deleted." });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

// Upload files to Bunny

const upload = multer({ storage: multer.memoryStorage() });
app.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const file = req.file;
    const username = req.body.username;
    const id = req.body.id;

    if (!file) {
      console.log("❌ No file received");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = file.path;

    const uploadUrl = `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${username}/${file.originalname}`;

    try {
      await axios.put(uploadUrl, file.buffer, {
        headers: {
          AccessKey: process.env.BUNNY_API_KEY,
          "Content-Type": file.mimetype,
        },
      });

      const publicUrl = `${process.env.BUNNY_CDN_URL}/${username}/${file.originalname}`;

      res.json({ id, name: file.originalname, url: publicUrl });
    } catch (err) {
      console.error("❌ Upload Failed:", {
        message: err.message,
        data: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });

      res.status(500).json({
        error: "Upload failed",
        details: err.response?.data || err.message,
      });
    }
  }
);

// Payment Methods
app.get("/payment-methods", authenticateToken, async (req, res) => {
  const userId = req.user?.userId;

  try {
    const { data } = await supabase
      .from("payment-methods")
      .select("*")
      .eq("userId", userId);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/payment-methods/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("payment-methods")
      .select("*")
      .eq("id", id)
      .single();

    if (error)
      return res
        .status(400)
        .json({ message: "Payment method couldn't be found" });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

app.post("/payment-methods", authenticateToken, async (req, res) => {
  const userId = req.user?.userId;
  const { name, type, budgets } = req.body;

  const sentData = {
    userId,
    name,
    type,
    budgets,
  };

  try {
    const { data, error } = await supabase
      .from("payment-methods")
      .insert([sentData])
      .select();

    if (error) return res.status(400).json({ message: error });

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/payment-methods/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;

  try {
    const { data, error } = await supabase
      .from("payment-methods")
      .update(updatedBody)
      .eq("id", id)
      .single();

    if (error)
      return res
        .status(400)
        .json({ message: "Payment method couldn't be updated." });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
});

app.delete("/payment-methods/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("payment-methods")
      .delete()
      .eq("id", id);

    if (error)
      res.status(400).json({ message: "Payment method couldn't be deleted." });
    return res
      .status(200)
      .json({ message: "Payment method has been deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/recovery/:slug", async (req, res) => {
  const { slug } = req.params;
  const { securityName } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("recoveryUrl", slug)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "Recovery link not found." });
    }

    if (user.securityName !== securityName) {
      return res.status(401).json({ message: "Incorrect security name." });
    }

    return res.status(200).json({ message: "Verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/recovery/:slug/reset", async (req, res) => {
  const { slug } = req.params;
  const { newPasscode } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("recoveryUrl", slug)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found." });
    }

    const hashed = await bcrypt.hash(newPasscode, 10);

    await supabase.from("users").update({ passcode: hashed }).eq("id", user.id);

    res.status(200).json({ message: "Passcode updated successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// Transaction Categories
app.get("/transaction-categories", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("transaction-categories")
      .select("*")
      .eq("user_id", req?.user?.userId);

    if (error) return res.status(400).json(error);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/transaction-categories/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  try {
    const { data, error } = await supabase
      .from("transaction-categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(400).json({ message: error });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.post("/transaction-categories", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const combineData = { ...req.body, user_id: userId };

  try {
    const { data, error } = await supabase
      .from("transaction-categories")
      .insert(combineData)
      .select("*")
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.put("/transaction-categories/:id", authenticateToken, async (req, res) => {
  const updatedData = req.body;

  try {
    const { data, error } = await supabase
      .from("transaction-categories")
      .update(updatedData)
      .eq("id", updatedData?.id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

app.delete(
  "/transaction-categories/:id",
  authenticateToken,
  async (req, res) => {
    const deleteThisId = req.params.id;

    try {
      const { error } = await supabase
        .from("transaction-categories")
        .delete()
        .eq("id", deleteThisId);

      if (error) return res.status(400).json({ message: error });
      return res
        .status(200)
        .json({ message: "Transaction category has been deleted" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
);

app.listen(process.env.PORT, () => console.log("Server running!"));
