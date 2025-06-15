import express from "express";
import bcrypt from "bcryptjs";
import fs, { write } from "fs";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const DB_PATH = "./db.json";

const readUsers = () => {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data).users || [];
};

const readCurrencies = () => {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data).currencies || [];
};

const writeCurrencies = (newCurrency) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  db.currencies = newCurrency;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

const writeUsers = (updatedUsers) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  db.users = updatedUsers;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// Transactions
const readTransactions = () => {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data).transactions || [];
};

const writeTransactions = (newTransactions) => {
  const db = JSON.parse(fs.readFileSync(DB_PATH));
  db.transactions = newTransactions;
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// Root route
app.get("/", (req, res) => {
  res.send("API is running 🎉");
});

// Currencies
app.get("/currencies", async (req, res) => {
  try {
    const currencies = readCurrencies();
    res.json(currencies); // assuming your JSON has a "users" array
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get(`/currencies/:id`, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const currencies = readCurrencies();
    const currency = currencies.find((currency) => currency.id === id);
    res.json(currency);
  } catch {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post("/currencies", async (req, res) => {
  const currencies = readCurrencies();
  currencies.push(req.body);
  writeCurrencies(currencies);
  res.status(201).json({ message: "Currency successfully created!" });
});

app.put("/currencies/:id", (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;

  const currencies = readCurrencies();
  const index = currencies.findIndex((k) => k.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ error: "Currency not found" });
  }

  currencies[index] = {
    ...currencies[index],
    ...updatedBody,
  };

  writeCurrencies(currencies);
  res.json(currencies[index]);
});

// Users
app.get("/users", async (req, res) => {
  try {
    const users = readUsers();
    res.json(users); // assuming your JSON has a "users" array
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

// Example users POST route
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  const users = readUsers();
  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ message: "Email already exists." });
  }

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "Username is already occupied." });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({
    ...req.body,
    password: hashed,
  });

  writeUsers(users);
  res.status(201).json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "User was not found." });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Check your credentials again." });
  }

  if (user && isMatch) {
    return res.status(200).json({ message: "Login successfull", user });
  }
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = readTransactions();
    const currencies = readCurrencies();

    const transactionsWithCurrency = transactions.map((transaction) => {
      const currency = currencies.find((c) => c.id === transaction.currencyId);

      return {
        ...transaction,
        currency: currency || null,
      };
    });

    res.json(transactionsWithCurrency);
  } catch {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get("/transactions/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const transactions = readTransactions();
    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const currencies = readCurrencies();
    const currency = currencies.find((c) => c.id === transaction.currencyId);

    const transactionWithCurrency = {
      ...transaction,
      currency: currency || null,
    };

    res.json(transactionWithCurrency);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to read database" });
  }
});

// Transactions
app.post("/transactions", async (req, res) => {
  const transactions = readTransactions();
  transactions.push({
    ...req.body,
  });

  writeTransactions(transactions);
  res.status(201).json({ message: "Transaction Added!" });
});

app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const updatedBody = req.body;

  const transactions = readTransactions();
  const index = transactions.findIndex((k) => k.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  transactions[index] = {
    ...transactions[index],
    ...updatedBody,
  };

  writeTransactions(transactions);
  res.json(transactions[index]);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
