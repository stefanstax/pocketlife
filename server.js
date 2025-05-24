const jsonServer = require("json-server");
const bcrypt = require("bcryptjs");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Register route with unique email check
server.post("/users", async (req, res, next) => {
  const { email, password } = req.body;
  const users = router.db.get("users").value();

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Email already in use" });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  req.body.password = hashedPassword;

  next();
});

// Default JSON Server routes
server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
