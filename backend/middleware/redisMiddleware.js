const Redis = require('@upstash/redis').Redis;
const Ratelimit = require("@upstash/ratelimit").Ratelimit;

const redis = Redis.fromEnv()
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "15 m"),
});

const upstashRateLimit = async (req, res, next) => {
  try {
    const key = req.user?.id || req.headers["x-forwarded-for"] || "anon";

    const { success, limit, remaining } = await ratelimit.limit(key);

    if (!success) {
      return res.status(429).json({
        error: "Too many requests",
        limit,
        remaining,
      });
    }

    next();   
  } catch (err) {
    next(err); 
  }
};

module.exports = {redis,ratelimit,upstashRateLimit}