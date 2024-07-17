const jwt = require("jsonwebtoken");
const User = require("../model/user");

exports.authenticator = (req, res, next) => {
  try {
    const token = req.header("Authorisation");
    const user = jwt.verify(token, "magical-key-for-userAuthentication");
    User.findById(user.userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};


