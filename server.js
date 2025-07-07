import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes using ES module syntax
import authRoutes from './routes/auth.js';
import pollRoutes from './routes/pollRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// CORS configuration 
const allowedOrigins = [
  'http://localhost:5173',
  // Add your deployed frontend URL here
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json()); // Body parser middleware 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define routes 
app.use('/api/auth', authRoutes);
app.use('/api/polls', pollRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Voting App Backend is running!');
});

const PORT = process.env.PORT || 5001; // 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});