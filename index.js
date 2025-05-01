const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const routes = require('./routes/auth')
const cors = require('cors');

dotenv.config() // Read the secret map (.env file)

const app = express();


app.use(cors({
  origin: 'https://foodexpress-neon.vercel.app', // or your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// Middleware: Unpack gift boxes (JSON data)
app.use(express.json());

// Connect to the toy box (MongoDB)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.log('Connection failed:', err));

  // Routes
app.use('/', routes)

// Start the castle party! 🎉
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});