const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyJWT = (req, res, next) => {
  try {
    const token = req.cookies?.token ||
                  (req.headers.authorization?.startsWith("Bearer ") && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Token missing", success: false });
    }

    const { id } = jwt.verify(token, JWT_SECRET);

    if (!id) {
      return res.status(403).json({ message: "Invalid token", success: false });
    }

    req.user = id;
    next();
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expired" :
      error.name === "JsonWebTokenError" ? "Invalid token" :
      "Token verification failed";

    res.status(401).json({ message, success: false });
  }
};
