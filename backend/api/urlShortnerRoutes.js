const express = require("express")
const router = express.Router();
const urlShortner = require("../models/urlShortner")
const {redis} = require("../middleware/redisMiddleware")
const {optionalAuthMiddleware} = require("../middleware/optionalAuthMiddleware");
const URL = "https://url-shortener-forkd.vercel.app/url/";
const User = require("../models/User");

router.post("/short", optionalAuthMiddleware,async (req, res) => {
  const { url } = req.body;
  if(!url){
    return res.status(400).json({msg:"Url Not provided"})
  }
  
    try {
      let result = await urlShortner.create({ originalUrl: url });

      await redis.set(result._id.toString(), url, { ex: 500 });

      return res.json({ shortUrl: URL + result._id });

    } catch (error) {
      // console.log("Create failed, checking existing URL...");
      const result = await urlShortner.findOne({ originalUrl: url });
      if (!result) {
        return res.status(400).json({ msg: "Couldn't create or find URL" });
      }
    }
    await redis.set(result._id.toString(), url, { ex: 500 });
    if(req.user){
    const userId = req.user.id;
    const userDoc = await User.findById(userId);
    if(!userDoc){
      return res.status(400).json({msg:"Something went wrong"});
    }
    userDoc.ShortUrls.append(URL + result._id);
    try{
    await userDoc.save()
    }catch{
      res.status(400).json({msg:"Url Not Created"})
    }
    return res.json({ shortUrl: URL + result._id });
  }
});


router.get("/:id",optionalAuthMiddleware, async (req, res) => {
  const { id } = req.params;

  const cachedUrl = await redis.get(id);

  if (cachedUrl) {
    return res.status(307).redirect(cachedUrl);
  }

  const result = await urlShortner.findById(id);

  if (!result) {
    return res.status(404).json({ msg: "Short URL not found" });
  }

  await redis.set(id, result.originalUrl, { ex: 500 }); //Cache the request
  if(req.user){
    await redis.incr(`clicks:${id}`); //Click Counts
  }

  return res.status(307).redirect(result.originalUrl);
});


module.exports = router;