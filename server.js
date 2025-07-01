import express from "express";
import bcrypt from "bcryptjs";
import cors from "cors";
import multer from "multer";
import { supabase } from "./supabaseClient.js";

const app = express();
app.use(express.json());
app.use(cors());

import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// Currencies
app.get("/currencies", async (req, res) => {
  try {
    const { data, error } = await supabase.from("currencies").select("*");

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get(`/currencies/:id`, async (req, res) => {
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

app.post("/currencies", async (req, res) => {
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

app.put("/currencies/:code", async (req, res) => {
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

app.delete("/currencies/:code", async (req, res) => {
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
app.get("/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
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
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existing)
      return res.status(409).json({ message: "Maybe try some other email." });

    const { data, error } = await supabase.from("users").insert([newUserData]);

    if (error) return res.status(400).json({ message: error.message });

    const insertedUser = data[0];
    const { password: _, ...user } = insertedUser;

    res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
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
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/transactions", async (req, res) => {
  const { userId, page, limit, sortBy = "date", order = "desc" } = req.query;

  try {
    const { data: currencies, error: currencyError } = await supabase
      .from("currencies")
      .select("*");

    if (currencyError) return res.status(400).json({ message: error.message });

    const { data: transactions, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("userId", userId);

    if (transactionError)
      return res.status(400).json({ message: error.message });

    if (!userId) {
      return res.status(200).json({
        message: "Please login first to see your transactions.",
      });
    }

    const filtered = transactions.filter(
      (transaction) => transaction.userId === userId
    );

    const transactionsWithCurrency = filtered.map((transaction) => {
      const currency = currencies.find(
        (c) => c.code === transaction.currencyId
      );
      return {
        ...transaction,
        currency: currency || null,
      };
    });

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);

    const sortTransactions = transactionsWithCurrency.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (!valA || !valB) return 0;

      if (typeof valA === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return order === "asc" ? valA - valB : valB - valA;
    });

    const paginatedTransactions = sortTransactions.slice(startIndex, endIndex);

    res.json({
      data: paginatedTransactions,
      total: transactionsWithCurrency.length,
      page,
      limit,
    });
  } catch {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get("/transactions/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
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
app.post("/transactions", async (req, res) => {
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

app.put("/transactions/:id", async (req, res) => {
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

app.delete("/transactions/:id", async (req, res) => {
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
app.post("/upload", upload.single("file"), async (req, res) => {
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
});

app.listen(3000, () => console.log("Server running!"));
