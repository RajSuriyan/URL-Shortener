const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const passport = require("../config/passportConfig");

// SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hashed, refreshTokens: [] });
  await user.save();

  res.json({ message: "Signup successful" });
});

// LOGIN (Local + JWT)
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ error: info?.message || "Login failed" });

    // attach user manually because no session
    req.user = user;

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,        // keep true when deploying with HTTPS
      sameSite: "Strict",
    });

    res.json({ accessToken });
  })(req, res, next);
});


// REFRESH TOKEN ROUTE
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "No refresh token" });

  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) return res.status(403).json({ error: "Invalid refresh token" });

  // Rotate refresh token (optional but recommended)
  user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
  const newRefresh = crypto.randomBytes(40).toString("hex");
  user.refreshTokens.push(newRefresh);
  await user.save();

  const newAccess = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "30m" });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Strict",
    });
  res.json({ newAccess});
});

module.exports = router;
