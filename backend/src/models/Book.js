import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    trim: true
  },
  coverUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  genres: [{
    type: String,
    trim: true
  }],
  publishedYear: {
    type: Number
  },
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create text index for search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

export const Book = mongoose.model('Book', bookSchema); 