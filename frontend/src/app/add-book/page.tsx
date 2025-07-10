'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function AddBook() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const sampleBooks = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
      genres: ['Fiction', 'Classic', 'Romance'],
      publishedYear: 1925
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'The story of young Scout Finch and her father Atticus in a racially divided Alabama town.',
      genres: ['Fiction', 'Classic', 'Drama'],
      publishedYear: 1960
    },
    {
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian novel about totalitarianism and surveillance society.',
      genres: ['Fiction', 'Dystopian', 'Political'],
      publishedYear: 1949
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A romantic novel of manners that follows the emotional development of Elizabeth Bennet.',
      genres: ['Fiction', 'Romance', 'Classic'],
      publishedYear: 1813
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      description: 'A fantasy novel about a hobbit who embarks on an unexpected journey.',
      genres: ['Fantasy', 'Adventure', 'Fiction'],
      publishedYear: 1937
    }
  ];

  const addSampleBooks = async () => {
    setLoading(true);
    setSuccess('');

    try {
      for (const book of sampleBooks) {
        await axios.post('http://localhost:5000/api/books', book);
      }
      setSuccess('Sample books added successfully!');
    } catch (error) {
      console.error('Error adding books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem',
          color: '#333'
        }}>
          Add Sample Books
        </h1>
        
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          This will add 5 classic books to the database for testing the interface.
        </p>

        {success && (
          <div style={{
            background: '#efe',
            color: '#363',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            border: '1px solid #cfc'
          }}>
            {success}
          </div>
        )}

        <button
          onClick={addSampleBooks}
          disabled={loading}
          style={{
            background: loading ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '2rem'
          }}
        >
          {loading ? 'Adding books...' : 'Add Sample Books'}
        </button>

        <div style={{ 
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #eee'
        }}>
          <Link href="/books" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '500',
            marginRight: '1rem'
          }}>
            View Books
          </Link>
          <Link href="/" style={{
            color: '#667eea',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 