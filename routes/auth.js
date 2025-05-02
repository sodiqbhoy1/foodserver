const express = require('express')
const router = express.Router();

const {customersignup, customerSignin, customerForgotPassword, CustomerresetPassword} = require('../controllers/customerController')
const {vendorSignup, vendorSignin, getAllVendors, VendorForgotPassword, VendorresetPassword} = require('../controllers/vendorController')
const {couriersignup, courierSignin, courierForgotPassword, CourierresetPassword} = require('../controllers/courierController')


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
router.post('/forgotpassword/vendor', VendorForgotPassword )
// router.post('/forgotpassword/vendor', vendorForgotPassword )



// reset password route
router.post('/reset-password/courier/:token', CourierresetPassword);  // The token is sent in the URL
router.post('/reset-password/customer/:token', CustomerresetPassword);  // The token is sent in the URL
router.post('/reset-password/vendor/:token', VendorresetPassword);  // The token is sent in the URL



// get all vendors
router.get('/vendors', getAllVendors)

module.exports = router