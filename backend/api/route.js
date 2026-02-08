const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const passport = require("../config/passportConfig");
const isProd = process.env.NODE_ENV === "production";
const authMiddleware = require("../middleware/authMiddleware")
const RefreshToken = require("../models/refreshTokens");
// SIGNUP
router.post("/signup", async (req, res) => {
  const {userName, email, password } = req.body;
  if (!email || !password || !userName) return res.status(400).json({ error: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hashed,userName, refreshTokens: [] ,ShortUrls: [] });
  await user.save();

  res.json({ message: "Signup msgful" });
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
      { id: user.id, email: user.email,userName:user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const newRefresh = crypto.randomBytes(40).toString("hex");

    await RefreshToken.create({
      userId: user.id,
      token: newRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    const cookieOptions = {
      httpOnly: true,
      secure: true,        // REQUIRED for SameSite=None
      sameSite: "None",    // REQUIRED for cross-origin fetch
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge:  15 * 60 * 1000
    });

    res.cookie("refreshToken", newRefresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ msg: true,userName:user.userName});

  })(req, res, next);   // ← correct passport invocation
});


router.get("/logout",async (req,res)=>{
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,                 // true ONLY in prod
    sameSite: isProd ? "None" : "Lax",
    path: "/",
  };
  res.cookie("accessToken", "", {
    ...cookieOptions,
    maxAge: 0
  });

  res.cookie("refreshToken", "", {
    ...cookieOptions,
    maxAge: 0
  });

  res.json({ msg: true });
});

module.exports = router;
