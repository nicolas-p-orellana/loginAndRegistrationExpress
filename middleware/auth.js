//jwt is use to create a token for the user to login with.
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //If a user is authorized send the "Authorization" string.
  const authHeader = req.get("Authorization");

  //if the user is no authorized sends false.
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  //This decodes the token for verification.
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
