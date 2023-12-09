const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctor");

const Authenticate = async (req, res, next) => {
   try {
      let token;

      if (
         req.headers.authorization &&
         req.headers.authorization.startsWith("Bearer")
      ) {
         // Get token from header
         token = req.headers.authorization.split(" ")[1];

         // Verify token
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         // Get user from the token
         req.user = await Doctor.findById(decoded.id).select("-password");

         // If there's no user, return an error
         if (!req.user) {
            return res.status(401).json({ error: "User not found" });
         }

         // Call the next middleware
         next();
      } else {
         throw new Error("Not authorized, no token");
      }
   } catch (error) {
      console.log(error.message);

      // Return an unauthorized response
      res.status(401).json({ error: "Not authorized" });
   }
};

const verifyToken = (req, res, next) => {
   Authenticate(req, res, next);
};

module.exports = {
   Authenticate,
   verifyToken,
};
