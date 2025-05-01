const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash the password before saving the buyer
courierSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Create a model for the buyer
const courier = mongoose.model('Courier', courierSchema);

module.exports = courier;