const User = require("../models/user.model");
const twilio = require("../config/twilio.config");
const phoneVerification = twilio.twilioPhoneVerification();

module.exports = {
  getAllEmployees: (req, res, next) => {
    User.find({})
      .then(users => {
        res
          .status(200)
          .json({ message: "Employees retreived successfully", data: users });
      })
      .catch(error => {
        next(error);
      });
  },

  deleteEmployee: (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
      .then(deleteInfo => {
        if (deleteInfo.deletedCount > 0) {
          res
            .status(200)
            .json({ message: "Employee deleted successfully", data: [] });
        } else {
          res.status(500).json({ message: "Something looks wrong :( !!!" });
        }
      })
      .catch(error => {
        next(error);
      });
  },

  updateEmployee: (req, res, next) => {
    User.updateOne(
      { _id: req.body._id },
      { name: req.body.name, domain: req.body.domain, salary: req.body.salary }
    )
      .then(updateInfo => {
        if (updateInfo.ok) {
          res
            .status(200)
            .json({ message: "Employee updated successfully", data: [] });
        } else {
          res.status(500).json({ message: "Something looks wrong :( !!!" });
        }
      })
      .catch(error => {
        next(error);
      });
  },

  sendOTPForVerification(req, res, next) {
    phoneVerification.requestPhoneVerification(req.body.phone, req.body.code, req.body.via, (err, result) => {
      if(err) {
        res.status(400).json({ message: err.message });;
      } else {
        res.status(200).json({ message: result.message });
      }
    })
  },

  verifyOTP(req, res, next) {
    phoneVerification.verifyPhoneToken(
      req.body.phone,
      req.body.code,
      req.body.token,
      (err, result) => {
        if (err) {
          res.status(400).json({ message: err.message });
        } else {
          User.updateOne(
            { _id: req.body._id },
            {
              isVerified:true,
            }
          )
            .then(updateInfo => {
              if (updateInfo.nModified > 0) {
                res
                  .status(200)
                  .json({ message: "Phone number verified successfully", data: [] });
              } else {
                res
                  .status(500)
                  .json({ message: "Something looks wrong :( !!!" });
              }
            })
            .catch(error => {
              res.status(400).json({message: error.message});
            });
        }
      }
    );
  }
};
