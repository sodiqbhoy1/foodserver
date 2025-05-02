const mongoose = require('mongoose');

// Create a schema for the buyer
const courierSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
      },
    
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
    
      phone: {
        type: String,
        required: true,
        trim: true,
      },
    
      address: {
        type: String,
        required: true,
      },
    
      state: {
        type: String,
        required: true,
      },
    
      city: {
        type: String,
        required: true,
      },
    
      password: {
        type: String,
        required: true,
      },
    
      experienceInLogistics: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
      },
    
      ecommerceLogistics: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
      },
      courierLicense: {
        type: String,
        enum: ['yes', 'no'],
        required: true,
      },
    
      createdAt: {
        type: Date,
        default: Date.now,
      },
    resetPasswordToken: String,       // Add this
    resetPasswordExpires: Date, 

});


// Create a model for the buyer
const courier = mongoose.model('Courier', courierSchema);

module.exports = courier;