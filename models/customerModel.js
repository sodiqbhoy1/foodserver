const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash the password before saving the buyer
customerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Create a model for the buyer
const customer = mongoose.model('Customer', customerSchema);

module.exports = customer;