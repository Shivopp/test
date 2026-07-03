const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv')
const axios = require('axios');

dotenv.config();
// 1. Import all route middleware controllers
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.get('/ping', (req, res) => {
  res.status(200).send('Server is alive');
});

// 2. Global Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads

// 3. Mount Routes API Endpoints
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// 4. Test Root Route Endpoint
app.get('/', (req, res) => {
  res.send('API Gateway Status: Connected and Running! 🚀');
});

// 5. Connect Engine to MongoDB Cloud Database Cluster
const dbURI = process.env.MONGO_URI;

async function connectDB(url) {
  try {
    await mongoose.connect(url);
    console.log("🚀 Success: Connected securely to MongoDB Cloud Database!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`📡 Server is live and running on port: ${PORT}`);
    });
  }
  catch (err){
    console.error("❌ Database Connection Error: ", err.message);
  };

}
connectDB(dbURI);


setInterval(() => {

  axios.get('https://ecart-backend-yocf.onrender.com/ping')
    .then(() => console.log('Self-ping successful: Server kept awake'))
    .catch((err) => console.error('Self-ping failed:', err.message));
}, 12 * 60 * 1000); 