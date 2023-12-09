const Report = require("../models/report");

// Define the route handler
const statusReports = async (req, res) => {
   try {
      // Extract the status parameter from the request
      const { status } = req.params;

      // Query the database for reports with the specified status
      const result = await Report.find({ status: status });

      // Check if there are reports matching the status
      if (result.length > 0) {
         // Send reports as a JSON response
         return res.status(200).json(result);
      } else {
         // Send a message indicating no results
         return res.status(200).json({ message: "There are no results found!" });
      }
   } catch (error) {
      // Handle errors by sending a 400 status and the error information
      return res.status(400).json(error);
   }
};

// Export the route handler
module.exports = { statusReports };
