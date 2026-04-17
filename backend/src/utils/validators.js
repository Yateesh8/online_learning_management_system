// Email validation
const validateEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

// Password validation (min 6 chars)
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
const validateName = (name) => {
  return name && name.trim().length >= 3;
};

// REGISTER VALIDATOR (middleware)
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validateName(name)) {
    return res.status(400).json({ message: "Name must be at least 3 characters" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  next();
};

// LOGIN VALIDATOR (middleware)
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  next();
};

module.exports = { validateRegister, validateLogin };