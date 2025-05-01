const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customerModel'); // Import the Customer model
const nodemailer = require('nodemailer');

const customersignup = async (req, res) => {
    const { name, email, password, address, phone } = req.body;

    try {
        // Check if the email already exists
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newCustomer = new Customer({
            name,
            email,
            password, // Save the hashed password
            address,
            phone
        });

        // Save the user
        await newCustomer.save();

        // Return a success message
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const customerSignin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the seller email exists
        const existingCustomer = await Customer.findOne({ email });
        if (!existingCustomer) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, existingCustomer.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: existingCustomer._id, email: existingCustomer.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Return the token
        res.status(200).json({
            message: 'Signin successful',
            token: token,
            customer: {
                fullName: existingCustomer.name,
                Address: existingCustomer.address,
                email: existingCustomer.email,
                phone: existingCustomer.phone
            }
        });

    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const customerForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!process.env.JWT_SECRET || !process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
            console.error('Environment variables are not properly configured.');
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if the seller email exists
        const existingCustomer = await Customer.findOne({ email });
        if (!existingCustomer) {
            return res.status(400).json({ error: 'Email not found' });
        }

        // Generate a password reset token
        const token = jwt.sign(
            { userId: existingCustomer._id, email: existingCustomer.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' } // Token expires in 10 minutes
        );

        // Save the token and expiration time
        existingCustomer.resetPasswordToken = token;
        existingCustomer.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

        await existingCustomer.save();

        // Send email with reset link
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            }
        });

        const resetUrl = `http://localhost:5173/reset-password/${token}`;
        await transporter.sendMail({
            from: 'FoodXpress <noreply@Foodxpress.com>',
            to: existingCustomer.email,
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

const CustomerresetPassword = async (req, res) => {
    const { token } = req.params; // Get token from URL parameter
    const { newPassword } = req.body;

    try {
        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }

        // Verify token
        const user = await Customer.findOne({
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

module.exports = { customersignup, customerSignin, customerForgotPassword, CustomerresetPassword };
