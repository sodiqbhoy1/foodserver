const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Create a schema for the seller
const vendorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'FullName is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    storeName:{
        type: String,
        required: [true, 'Store Name is required']
    },
    storeAddress:{
        type: String,
        required: [true, 'Store Address is required']
    },

    city:{
        type: String,
        required: [true, 'City is required']
    },
    state:{
        type: String,
        required: [true, 'State is required']
    },
    storeLicense:{
        type: String,
        required: [true, 'Store License is required']
    },
    resetPasswordToken: String,       // Add this
    resetPasswordExpires: Date, 


});

// Hash the password before saving the seller
vendorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Create a model for the seller
const vendor= mongoose.model('Vendor', vendorSchema);
module.exports=vendor
