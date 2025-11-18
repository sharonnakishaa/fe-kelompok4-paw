const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Jika sudah terkoneksi, skip
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return;
  }

  try {
    // Set mongoose options untuk serverless
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isConnected = true;
    console.log(
      "Database connected:", 
      conn.connection.host, 
      conn.connection.name
    );
  } catch (err) {
    console.error("Cannot connect to database:", err.message);
    isConnected = false;
    // JANGAN gunakan process.exit() di serverless!
    // Throw error agar bisa di-handle oleh error handler
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

module.exports = { connectDB };
