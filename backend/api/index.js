const express = require('express')
require("dotenv").config()
const fs = require('fs')
const workouts = require("./api")
const mon = require("mongoose")
const passport = require("../config/passportConfig")
const authMiddleware = require("../middleware/authMiddleware");
const authRoutes = require("./route")
const urlShortnerRoutes = require("./urlShortnerRoutes")
const app = express()
const cors = require("cors")
const connectDB = require("../db/connectDb")
const {upstashRateLimit} = require("../middleware/redisMiddleware")
const cookieParser = require('cookie-parser')
// app.use(upstashRateLimit)

app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://url-shortener-three-pi.vercel.app",
    "https://localhost:5173"
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
app.use("/url",urlShortnerRoutes)

app.get("/",(req , res) => {
    res.json({"message":"API is working"})
})
app.get("/me",authMiddleware,(req , res) => {
    res.json({"sucess":true,userName:req.user.userName})
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

