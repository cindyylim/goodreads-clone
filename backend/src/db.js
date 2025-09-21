import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/goodreads-clone';
    
    // If it's a local MongoDB connection, remove the query parameters
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      uri = uri.split('?')[0]; // Remove query parameters for local MongoDB
    }
    
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

