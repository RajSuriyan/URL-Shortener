const express = require("express")
const router = express.Router();
const urlShortner = require("../models/urlShortner")
const {redis} = require("../middleware/redisMiddleware")
const URL = "https://url-shortener-forkd.vercel.app/url/";
const User = require("../models/User");

router.post("/short",async (req, res) => {

  const { url } = req.body;
  if(!url){
    return res.status(400).json({msg:"Url Not provided"})
  }

  let currUrl = null;

    try {
      const result = await urlShortner.create({ originalUrl: url ,count:0});

      await redis.set(result._id.toString(), url, { ex: 500 });

      currUrl = result._id;

    } catch (error) {
      // console.log("Create failed, checking existing URL...");
      const result = await urlShortner.findOne({ originalUrl: url });
      await redis.set(result._id.toString(), url, { ex: 500 });
      currUrl = result._id;
      if (!result) {
        return res.status(400).json({ msg: "Couldn't create or find URL" });
      }
    }

  if(req.user){
    const userId = req.user.id;
    try{
    await User.findByIdAndUpdate(userId,{ $addToSet: { ShortUrls: currUrl } },{ new: true });
    }catch(err){
      return res.status(400).json({msg:"User Id Not Found"})
    }
  }
    
  return res.json({ shortUrl: URL + currUrl });

});


router.get("/:id", async (req, res) => {
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
  await redis.incr(`clicks:${id}`); //Click Counts

  return res.status(307).redirect(result.originalUrl);
});


module.exports = router;