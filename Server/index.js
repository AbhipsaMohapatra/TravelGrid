const express = require('express');
const bookingRoutes = require("./routes/booking.js");
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const bookingRouter = require('./routes/bookingRoutes');

const postRoutes = require('./routes/postRoutes')
const saveRoutes = require('./routes/saveRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
connectDB();

// Middleware
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production'
//     ? 'https://travel-grid.vercel.app'
//     : '*',
//   credentials: true
// }));
const allowedOrigins = [
  'http://localhost:5173',
  'https://travel-grid.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());

app.get('/',(req,res)=>{
  res.send("Hello world")
})

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running smoothly!' });
});
// Authentication Routes
app.use('/api/auth', authRoutes);

app.use('/api/bookings', bookingRouter)

//Posts Route
app.use('/api/post',postRoutes);

//save Route
app.use('/api/save', saveRoutes);

// 404 Not Found middleware
app.use((req,res,next)=>{
  res.status(404).json({message:'Resource not found'});
});
// Error handling middleware global
app.use((err,req,res,next)=>{
  console.error(err.stack);
  res.status(500).json({message:"Internal Server Error"});

});

// server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
