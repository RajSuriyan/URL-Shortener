const express = require("express")
const router = express.Router();
const urlShortner = require("../models/urlShortner")
const {redis} = require("../middleware/redisMiddleware")

const URL = "https://url-shortener-forkd.vercel.app/url/";

router.post("/short", async (req, res) => {
  const { url } = req.body;

  try {
    let result = await urlShortner.create({ originalUrl: url });

    await redis.set(result._id.toString(), url, { ex: 500 });

    return res.json({ shortUrl: URL + result._id });

  } catch (error) {
    console.log("Create failed, checking existing URL...");

    const result = await urlShortner.findOne({ originalUrl: url });

    if (!result) {
      return res.status(400).json({ msg: "Couldn't create or find URL" });
    }

    await redis.set(result._id.toString(), url, { ex: 500 });

    return res.json({ shortUrl: URL + result._id });
  }
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

  await redis.set(id, result.originalUrl, { ex: 500 });

  return res.status(307).redirect(result.originalUrl);
});


module.exports = router;