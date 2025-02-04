const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');

require('dotenv/config');





// Initialize Express app
const app = express();

app.use(cors())
app.options('*',cors())

// Environment Variables
const api = process.env.API_URL || '/api/v1';

// Middleware
app.use(authJwt());
app.use(express.json());
app.use(morgan('tiny')); // Logging middleware
app.use(errorHandler); 


// Routes
const productsRouter = require('./routes/products');
app.use(`${api}/products`, productsRouter);

const categoryRouter = require('./routes/categories');
app.use(`${api}/categories`, categoryRouter);

const userRouter = require('./routes/users');
app.use(`${api}/users`, userRouter);


const ordersRoutes = require('./routes/orders');
app.use(`${api}/orders`, ordersRoutes);

// MongoDB Connection
const mongoUrl = 'mongodb://localhost/CatagoryDb';
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to Db');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

// Server Initialization
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try using a different port.`);
    process.exit(1);
  } else {
    console.error('Error starting server:', err);
  }
});
