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

// Currencies
app.get("/currencies", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("currencies").select("*");

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
  const newCurrency = req.body;

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
  const updatedBody = req.body;

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
      .eq("id", id)
      .single();
    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);
  const newUserData = {
    username,
    email,
    password: hashed,
  };

  try {
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},username.eq.${username}`)
      .maybeSingle();

    if (existing)
      return res
        .status(409)
        .json({ message: "Either email or username already exist." });

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
    res
      .status(200)
      .json({ message: "User has been successfully updated.", ...data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "User was not found." });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Double check your credentials." });
    }

    const { password: _, ...user } = data;
    const token = jwt.sign(
      {
        userId: user?.id,
        email: user?.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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
    // Fetch currencies and payment methods in parallel
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

    // Fetch paginated transactions and total count in one call
    const {
      data: transactions,
      error,
      count,
    } = await supabase
      .from("transactions")
      .select("*", { count: "exact" }) // include count and data
      .eq("userId", userId)
      .order("created_at", { ascending: false })
      .range(startIndex, endIndex);

    if (error) return res.status(500).json({ message: error.message });

    // Single pass merge
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
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert(req.body);

    if (error) return res.status(400).json({ message: error.message });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/transactions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .update(updatedBody)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/transactions/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (id)
      return res
        .status(400)
        .json({ message: "Please double check delete parameters." });
    if (error) return res.status(400).json({ message: error?.message });

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
  const { name, type } = req.body;

  const sentData = {
    userId,
    name,
    type,
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

app.listen(process.env.PORT, () => console.log("Server running!"));
