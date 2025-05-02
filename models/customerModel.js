const mongoose = require('mongoose');


// Create a schema for the buyer
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    resetPasswordToken: String,       // Add this
    resetPasswordExpires: Date, 

});

// Create a model for the buyer
const customer = mongoose.model('Customer', customerSchema);

module.exports = customer;