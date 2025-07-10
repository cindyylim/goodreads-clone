const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');
const Book = require('./src/models/Book');

// Test MongoDB connection
async function testConnection() {
  try {
    // Use the MONGODB_URI from .env file
    const testUri = process.env.MONGODB_URI;
    
    if (!testUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(testUri);
    console.log('✅ MongoDB connected successfully!');
    
    // Test User model
    console.log('\nTesting User model...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    await testUser.save();
    console.log('✅ User created successfully:', testUser._id);
    
    // Test Book model
    console.log('\nTesting Book model...');
    const testBook = new Book({
      title: 'Test Book',
      author: 'Test Author',
      description: 'A test book for our Goodreads clone',
      genres: ['Fiction', 'Test']
    });
    
    await testBook.save();
    console.log('✅ Book created successfully:', testBook._id);
    
    // Test password comparison
    const isMatch = await testUser.comparePassword('password123');
    console.log('✅ Password comparison test:', isMatch ? 'PASSED' : 'FAILED');
    
    // Clean up test data
    await User.deleteOne({ email: 'test@example.com' });
    await Book.deleteOne({ title: 'Test Book' });
    console.log('\n✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

testConnection(); 