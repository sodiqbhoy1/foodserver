const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendorModel'); // Assuming Seller is your Mongoose model


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
        // Save the seller
        await newVendor.save();
        // Return a success message
        res.status(201).json({message: 'Vendor created successfully'});
    }

    catch(error){
        console.error('Error during signup:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


// Seller signin
const vendorSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the seller email exists
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
      { sellerId: existingVendor._id, email: existingVendor.email },
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



module.exports = {vendorSignup, vendorSignin, getAllVendors};  // Export the signup function