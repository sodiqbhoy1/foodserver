const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Courier = require("../models/courierModel"); // Import the courier model
const nodemailer = require("nodemailer");

const couriersignup = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    address,
    state,
    city,
    password,
    experienceInLogistics,
    ecommerceLogistics,
    courierLicense

  } = req.body;

  try {
    // Check if the email already exists
    const existingCourier = await Courier.findOne({ email });
    if (existingCourier) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newCourier = new Courier({
      fullName,
      email,
      phone,
      address,
      state,
      city,
      password,
      experienceInLogistics,
      ecommerceLogistics,
      courierLicense


    });

    // Save the user
    await newCourier.save();

    // Return a success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// courier signin
const courierSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the seller email exists
    const existingCourier = await Courier.findOne({ email });
    if (!existingCourier) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingCourier.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate a token
    const token = jwt.sign(
      { userId: existingCourier._id, email: existingCourier.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return the token
    res.status(200).json({
      message: "Signin successful",
      token: token,
      Courier: {
        fullName: existingCourier.fullName,
        Address: existingCourier.address,
        email: existingCourier.email,
        phone: existingCourier.phone,
        city: existingCourier.city,
        state: existingCourier.state,
        LogisticsExperience: existingCourier.LogisticsExperience,
        deliveryExperience: existingCourier.deliveryExperience,
        licenseNumber: existingCourier.licenseNumber,
      },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// courier forgot password
const courierForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the seller email exists
    const existingCourier = await Courier.findOne({ email });
    if (!existingCourier) {
      return res.status(400).json({ error: "Email not found" });
    }

    // Generate a password reset token
    const token = jwt.sign(
      { userId: existingCourier._id, email: existingCourier.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" } // Token expires in 10 minutes
    );

    // Send the token to the user's email (you can use a mailing service here)
    Courier.resetPasswordToken = token; // Save the token in the database (optional)
    Courier.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Set expiration time for the token 10 minutes

    await existingCourier.save(); // Save the updated user document

    // send email with reset link
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    await transporter.sendMail({
      from: "FoodXpress <noreply@Foodxpress.com>",
      to: user.email,
      subject: "Reset Password",
      text: `You are receiving this email because you (or someone else) requested a password reset for your Foodxpress account.\n\n
        Please click on the following link to reset your password:\n\n
        ${resetUrl}\n\n
        If you did not request a password reset, please ignore this email and your password will remain unchanged.\n`,
    });
    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    res.status(500).json({ error: "Error sending mail" });
  }
};

// reset password
const CourierresetPassword = async (req, res) => {
  const { token } = req.params; // Get token from URL parameter
  const { newPassword } = req.body;

  try {
    // Verify token
    const user = await Courier.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Token is invalid or expired" });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  couriersignup,
  courierSignin,
  courierForgotPassword,
  CourierresetPassword,
}; // Export the signup function
