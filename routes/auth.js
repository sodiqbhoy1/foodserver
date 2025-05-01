const express = require('express')
const router = express.Router();

const {customersignup, customerSignin, customerForgotPassword} = require('../controllers/customerController')
const {vendorSignup, vendorSignin, getAllVendors} = require('../controllers/vendorController')
const {couriersignup, courierSignin, courierForgotPassword} = require('../controllers/courierController')


// signup routes
router.post('/signup/vendor', vendorSignup)
router.post('/signup/customer', customersignup)
router.post('/signup/courier', couriersignup)

// signin route
router.post('/signin/vendor', vendorSignin)
router.post('/signin/customer', customerSignin)
router.post('/signin/courier', courierSignin)

// forgot password route
router.post('/forgotpassword/courier', courierForgotPassword )
router.post('/forgotpassword/customer', customerForgotPassword )
// router.post('/forgotpassword/vendor', vendorForgotPassword )

// get all vendors
router.get('/vendors', getAllVendors)

module.exports = router