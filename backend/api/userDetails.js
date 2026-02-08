const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const passport = require("../config/passportConfig");
const isProd = process.env.NODE_ENV === "production";
const authMiddleware = require("../middleware/authMiddleware")
const urlShortner = require("../models/urlShortner")
const URL = "https://url-shortener-forkd.vercel.app/url/";


const getUrl = async (id) => {
  try {
    return await urlShortner.findById(id);
  } catch (e) {
    return null;
  }
};

router.get("/getdata", async (req, res) => {
  const userID = req.user.id;
  const user = await User.findById({_id:userID});
  if(!user){
    return res.status(400).json({msg:"User Doesn't Excist"})
  }
  const result = await urlShortner.find(
  { _id: { $in: user.ShortUrls } },
  { _id: 1, count: 1, createdAt: 1 } // fields to include
  );
  const updatedResults = result.map(({ originalUrl, _id, ...rest }) => ({
    ...rest,
    url: URL + _id
  }));
  res.json({msg:"Sucess",urlList:updatedResults})

});

router.delete("/deleteurl/:id", async (req, res) => {
  const {id} = req.params;
  try{
  await urlShortner.findByIdAndDelete({id:id});
  return res.json({msg:"Sucess"})
  }catch(err){
    return res.status(400).json({msg:"Url Doesn't exist"})
  }
});


module.exports = router;
 