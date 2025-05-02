const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendorModel'); // Assuming Vendor is your Mongoose model


const vendorSignup = async (req, res)=>{
    const { fullName, email, phone, password, storeName, storeAddress, city, state, storeLicense } = req.body;

    try{
        // Check if the email already exists
        const existingVendor = await Vendor.findOne({email});
        if (existingVendor){
            return res.status(400).json({error: 'Email already exists'});
        }
        // Create a new vendor
        const newVendor = new Vendor({
            fullName,
            email,
            phone,
            password,
            storeName,
            storeAddress,
            city,
            state,
            storeLicense
        });
        // Save the Vendor
        await newVendor.save();
        // Return a success message
        res.status(201).json({message: 'Vendor created successfully'});
    }

    catch(error){
        console.error('Error during signup:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


// Vendor signin
const vendorSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the Vendor email exists
    const existingVendor = await Vendor.findOne({ email });
    if (!existingVendor) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, existingVendor.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate a token
    const token = jwt.sign(
      { VendorId: existingVendor._id, email: existingVendor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token
    res.status(200).json({
      message: 'Signin successful',
      token: token,
      Vendor: {
        fullName: existingVendor.fullName,
        storeName: existingVendor.storeName,
        storeAddress: existingVendor.storeAddress,
        city: existingVendor.city,
        state: existingVendor.state,
        email: existingVendor.email,
        phone: existingVendor.phone
      }
    });

  } catch (error) {
    console.error('Error during signin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// fetch all vendors
const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({}, 'storeName storeAddress city state email phone'); // Fetch only the required fields
        res.status(200).json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Forgot password
const VendorForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      if (!process.env.JWT_SECRET || !process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
          console.error('Environment variables are not properly configured.');
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Check if the seller email exists
      const existingVendor = await Vendor.findOne({ email });
      if (!existingVendor) {
          return res.status(400).json({ error: 'Email not found' });
      }

      // Generate a password reset token
      const token = jwt.sign(
          { userId: existingVendor._id, email: existingVendor.email },
          process.env.JWT_SECRET,
          { expiresIn: '10m' } // Token expires in 10 minutes
      );

      // Save the token and expiration time
      existingVendor.resetPasswordToken = token;
      existingVendor.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

      await existingVendor.save();

      // Send email with reset link
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASSWORD,
          }
      });

      const resetUrl = `http://localhost:5173/reset-password/Vendor/${token}`;
      await transporter.sendMail({
          from: 'FoodXpress <noreply@Foodxpress.com>',
          to: existingVendor.email,
          subject: 'Reset Password',
          text: `You are receiving this email because you (or someone else) requested a password reset for your Foodxpress account.\n\n
            Please click on the following link to reset your password:\n\n
            ${resetUrl}\n\n
            If you did not request a password reset, please ignore this email and your password will remain unchanged.\n`
      });

      res.status(200).json({ message: 'Reset password email sent' });

  } catch (error) {
      console.error('Error sending forgot password email:', error);
      res.status(500).json({ error: 'Error sending mail' });
  }
};


// Reset password
// This function handles the password reset process
const VendorresetPassword = async (req, res) => {
  const { token } = req.params; // Get token from URL parameter
  const { newPassword } = req.body;

  try {
      if (!newPassword) {
          return res.status(400).json({ error: 'New password is required' });
      }

      // Verify token
      const user = await Vendor.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
          return res.status(400).json({ error: 'Token is invalid or expired' });
      }

      // Hash and update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();
      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {vendorSignup, vendorSignin, getAllVendors, VendorresetPassword, VendorForgotPassword };  // Export the signup function