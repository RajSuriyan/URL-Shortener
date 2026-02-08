const express = require('express');
const jwt = require("jsonwebtoken");
require("dotenv").config()
const fs = require('fs')
const workouts = require("./api");
const crypto = require("crypto");
const passport = require("../config/passportConfig");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const authRoutes = require("./route")
const urlShortnerRoutes = require("./urlShortnerRoutes")
const app = express()
const cors = require("cors")
const connectDB = require("../db/connectDb")
const {upstashRateLimit} = require("../middleware/redisMiddleware")
const cookieParser = require('cookie-parser')
const {optionalAuthMiddleware} = require("../middleware/optionalAuthMiddleware");
const userDetailsRoute = require("./userDetails");
const RefreshToken = require("../models/refreshTokens");
const isProd = process.env.NODE_ENV === "production";

if(isProd){
  app.use(upstashRateLimit)
}
app.use(cookieParser());

app.use(cors({
  origin: [
    "https://localhost:5173",
    "http://localhost:5173",
    "https://url-shortener-three-pi.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  credentials: true
}));

app.use(async (req, res, next) => {
  try {
    await connectDB();   // connect on request
    next();
  } catch (err) {
    res.status(500).json({ error: "DB connection failed" });
  }
});
app.use(express.json());

app.use(passport.initialize());      // 2. Start Passport (needed for login route)

app.use("/api/workouts", authMiddleware, workouts); // 3. Protect workouts using JWT

// 4. Your /login route should come AFTER passport.initialize()
//    but it does NOT need authMiddleware
app.use("/auth", authRoutes);
app.use("/url",optionalAuthMiddleware,urlShortnerRoutes)
app.use("/profile",authMiddleware,userDetailsRoute);
app.get("/",(req , res) => {
    res.json({"message":"API is working"})
})
app.get("/me",async (req , res) => {
  const accessToken =  req.cookies?.accessToken ?? req.headers?.authorization?.split(" ")[1] ?? null;
  const refreshToken = req.cookies?.refreshToken ?? null;
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {

    if (!refreshToken) return res.status(400).json({ error: "No refresh token" });
    
    const refresh = await RefreshToken.findOne({ token: refreshToken });
    
    if (!refresh) {
      return res.status(403).json({ error: "Invalid or reused refresh token" });
    }

    if (refresh.expiresAt < new Date()) {
      return res.status(403).json({ error: "Refresh token expired. Login again." });
    }

    const newRefresh = crypto.randomBytes(40).toString("hex");
    const user = await User.findById({_id:refresh.userId})
    await RefreshToken.create({
      userId: user.id,
      token: newRefresh,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await RefreshToken.deleteOne({id:refresh._id})


    const newAccess = jwt.sign({ id: user.id, email: user.email,userName:user.userName  }, process.env.JWT_SECRET, { expiresIn: "30m" });
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,                 // true ONLY in prod
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    };
    res.cookie("accessToken", newAccess, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 
    });
  
    res.cookie("refreshToken", newRefresh, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });    
  }
    res.json({"sucess":true})
})


// mon.connect(process.env.DB_URL).then(
//     ()=>{
//         app.listen(process.env.PORT,() => {
//     console.log("Server Started at 3000")
//         })
//     }
// ).catch(
//     (error)=>{console.log(error)}
// )


module.exports = app;

