const express = require('express');
const router = express.Router();

//Controllers routes
const employeeController = require('../controllers/employee.controller');

router.get('/all_employees', employeeController.getAllEmployees);
router.delete('/delete_employee/:id', employeeController.deleteEmployee);
router.put('/update_employee', employeeController.updateEmployee);
router.post('/sendOTP', employeeController.sendOTPForVerification);
router.post('/verifyOTP', employeeController.verifyOTP);

module.exports = router;