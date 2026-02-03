import { Redis } from "@upstash/redis";
import 'dotenv/config';
import mongoose from "mongoose";
import { env } from 'node:process';
const { Schema } = mongoose;


const UrlSchema = new Schema({
  originalUrl: {type: String, unique: true, required: true},
  count:{type:Number}
}, { timestamps: true });
const redis = Redis.fromEnv()

console.log("HI")
async function flushClicks() {

  await mongoose.connect(env.DB_URL!);
  const urlShortner = mongoose.model("urlShortner", UrlSchema);


  const keys = await redis.keys("clicks:*");
  console.log("Flushing click counters...",keys);

  for (const key of keys) {
    const id = key.replace("clicks:", "");
    console.log(id)
    const count = await redis.getset<number>(key, 0);

    if (!count || count === 0) continue;
    try{
    const urlDoc =  await urlShortner.findById(id);
    if(!urlDoc){
      continue
    }
    urlDoc.count = (urlDoc.count ?? 0) + 1
    await urlDoc.save()
  }catch(err){
    console.log(err);
  }
  }
}

// run every 60 seconds
setInterval(flushClicks, 60_000);
// setInterval(flushClicks, 60_000);
// graceful shutdown (Render sends SIGTERM)
process.on("SIGTERM", async () => {
  console.log("Worker shutting down...");
  await flushClicks();
  process.exit(0);
});
