const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token ", token);
    if (!token) {
      throw new Error("Authentication failed!");
    } else {
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      req.id = decodedToken.id;
      next();
    }
  } catch (error) {
    console.log("Invalid Token");
    throw new Error(error);
  }
};
