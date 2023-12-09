const Patient = require("../models/patient");
const Report = require("../models/report");

// Route handler for patient registration
const patientRegister = async (req, res, next) => {
   const { name, phone } = req.body;

   try {
      if (!name || !phone) {
         res.status(400);
         throw new Error("Please enter the name and phone");
      }

      const patientExist = await Patient.findOne({ phone });

      if (patientExist) {
         console.log("Patient already exists");
         res.status(200).json({
            _id: patientExist.id,
            name: patientExist.name,
            phone: patientExist.phone,
         });
      } else {
         const patient = await Patient.create({
            name,
            phone,
            doctor: req.user._id,
         });

         if (patient) {
            res.status(200).json({
               _id: patient.id,
               name: patient.name,
               phone: patient.phone,
            });
         } else {
            res.status(400);
            throw new Error("Invalid Patient");
         }
      }
   } catch (error) {
      next(error); // Pass the error to the error-handling middleware
   }
};

// Route handler for creating a report for a patient
const patientCreateReport = async (req, res, next) => {
   const { status } = req.body;

   try {
      if (!status) {
         res.status(400);
         throw new Error("Please enter the status");
      }

      const patientExist = await Patient.findById(req.params.id);

      if (patientExist) {
         const newReport = await Report.create({
            created_by: patientExist.doctor,
            status: req.body.status,
            date: Date(),
         });

         patientExist.report.push(newReport);
         patientExist.save();

         res.status(200).json({
            _id: newReport._id,
            Created_By: newReport.created_by,
            Status: newReport.status,
            Date: newReport.date,
         });
      } else {
         res.status(400);
         throw new Error("Invalid Patient");
      }
   } catch (error) {
      next(error); // Pass the error to the error-handling middleware
   }
};

// Route handler for retrieving all reports for a patient
const patientAllReports = async (req, res, next) => {
   try {
      const patientExist = await Patient.findById(req.params.id);

      if (patientExist) {
         const patientData = await Patient.findById(req.params.id).populate("report");
         res.status(200).json(patientData.report);
      } else {
         res.status(400);
         throw new Error("Invalid Patient");
      }
   } catch (error) {
      next(error); // Pass the error to the error-handling middleware
   }
};

module.exports = {
   patientRegister,
   patientCreateReport,
   patientAllReports,
};
