const jwt = require("jsonwebtoken");

function optionalAuthMiddleware(req, res, next) {
const token =  req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }
    
  next();

}


module.exports = optionalAuthMiddleware;