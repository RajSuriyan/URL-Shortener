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
  const user = new User({ email, password: hashed, refreshTokens: [] ,ShortUrls: [] });
  await user.save();

  res.json({ message: "Signup successful" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(400).json({ 
        error: info?.message || "Login failed" 
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");

    user.refreshTokens.push(refreshToken);
    await user.save();
    
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true });

  })(req, res, next);   // ← correct passport invocation
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
  const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };
  res.cookie("accessToken", newAccess, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ success: true });
});

module.exports = router;
