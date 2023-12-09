const Doctor = require("../models/doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate JWT Token here
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
   });
};

// Route handler for registering a doctor
const registerDoctor = async (req, res, next) => {
   const { name, password } = req.body;

   try {
      if (!name || !password) {
         res.status(400);
         throw new Error("Please fill in all the fields");
      }

      // Check if user exists
      const userExist = await Doctor.findOne({ name });

      if (userExist) {
         res.status(400);
         throw new Error("User already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      const user = await Doctor.create({
         name,
         password: hashedPassword,
      });

      if (user) {
         res.status(200).json({
            _id: user.id,
            name: user.name,
         });
      } else {
         res.status(400);
         throw new Error("Invalid User");
      }
   } catch (error) {
      next(error); // Pass the error to the error-handling middleware
   }
};

// Route handler for logging in a doctor
const loginDoctor = async (req, res, next) => {
   const { name, password } = req.body;

   try {
      const user = await Doctor.findOne({ name });

      if (user && (await bcrypt.compare(password, user.password))) {
         res.status(200).json({
            _id: user._id,
            name: user.name,
            token: generateToken(user._id),
         });
      } else {
         res.status(400);
         throw new Error("Invalid credentials");
      }
   } catch (error) {
      next(error); // Pass the error to the error-handling middleware
   }
};

// Route handler for retrieving the profile of a doctor
const profileDoctor = (req, res) => {
   res.status(200).json(req.user);
};

module.exports = {
   registerDoctor,
   loginDoctor,
   profileDoctor,
};
