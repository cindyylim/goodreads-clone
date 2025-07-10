const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./db');

// Import models
const User = require('./models/User');
const Book = require('./models/Book');
const Bookshelf = require('./models/Bookshelf');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Basic route
app.get('/', (req, res) => {
  res.send('Goodreads Clone API is running');
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!', timestamp: new Date().toISOString() });
});

// User routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    };
    
    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt
    };
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book routes
app.get('/api/books', async (req, res) => {
  try {
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    const total = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(limit);
    const pages = Math.ceil(total / limit);

    res.json({
      books,
      total,
      page,
      pages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, isbn, coverUrl, description, genres, publishedYear } = req.body;
    
    const book = new Book({
      title,
      author,
      isbn,
      coverUrl,
      description,
      genres,
      publishedYear
    });
    
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bookshelf routes
app.get('/api/users/bookshelf', authenticateToken, async (req, res) => {
  try {
    const bookshelf = await Bookshelf.find({ user: req.user.userId })
      .populate('book')
      .sort({ dateAdded: -1 });
    res.json(bookshelf);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/users/bookshelf', authenticateToken, async (req, res) => {
  try {
    const { bookId, status, rating, review } = req.body;
    const bookshelf = new Bookshelf({
      user: req.user.userId,
      book: bookId,
      status,
      rating,
      review
    });
    await bookshelf.save();
    res.status(201).json(bookshelf);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already added this book to your shelf.' });
    }
    console.error('Bookshelf POST error:', error);
    console.error('Request body:', req.body);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update bookshelf item
app.put('/api/users/bookshelf/:id', authenticateToken, async (req, res) => {
  try {
    const { status, rating, review } = req.body;
    const bookshelfId = req.params.id;
    
    const bookshelf = await Bookshelf.findOneAndUpdate(
      { _id: bookshelfId, user: req.user.userId },
      { status, rating, review },
      { new: true }
    );
    
    if (!bookshelf) {
      return res.status(404).json({ message: 'Bookshelf item not found' });
    }
    
    res.json(bookshelf);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete bookshelf item
app.delete('/api/users/bookshelf/:id', authenticateToken, async (req, res) => {
  try {
    const bookshelfId = req.params.id;
    
    const bookshelf = await Bookshelf.findOneAndDelete({
      _id: bookshelfId,
      user: req.user.userId
    });
    
    if (!bookshelf) {
      return res.status(404).json({ message: 'Bookshelf item not found' });
    }
    
    res.json({ message: 'Book removed from shelf' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
