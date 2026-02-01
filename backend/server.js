const fs = require("fs");
const https = require("https");

const app = require("./api/index");
const connectDB = require("./db/connectDb");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();

    const httpsOptions = {
      key: fs.readFileSync("../frontend/certs/localhost-key.pem"),
      cert: fs.readFileSync("../frontend/certs/localhost.pem"),
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(`🚀 HTTPS server running at https://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
