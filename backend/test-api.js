const http = require('http');

// Test the API endpoints
async function testAPI() {
  const baseURL = 'http://localhost:5000';
  
  console.log('Testing Goodreads Clone API...\n');
  
  // Test root endpoint
  try {
    const response = await makeRequest(`${baseURL}/`);
    console.log('✅ Root endpoint:', response);
  } catch (error) {
    console.log('❌ Root endpoint failed:', error.message);
  }
  
  // Test books endpoint
  try {
    const response = await makeRequest(`${baseURL}/api/books`);
    const books = JSON.parse(response);
    console.log('✅ Books endpoint:', books.length, 'books found');
    
    // If we have books, test the first one
    if (books.length > 0) {
      const firstBookId = books[0]._id;
      const bookResponse = await makeRequest(`${baseURL}/api/books/${firstBookId}`);
      const book = JSON.parse(bookResponse);
      console.log('✅ Book detail endpoint:', book.title, 'by', book.author);
    } else {
      console.log('⚠️  No books found to test book detail endpoint');
    }
  } catch (error) {
    console.log('❌ Books endpoint failed:', error.message);
  }
  
  // Test user registration
  try {
    const userData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    const response = await makeRequest(`${baseURL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(userData)
      }
    }, userData);
    
    console.log('✅ User registration:', JSON.parse(response).message);
  } catch (error) {
    console.log('❌ User registration failed:', error.message);
  }
  
  // Test adding a book
  try {
    const bookData = JSON.stringify({
      title: 'Test Book for API',
      author: 'Test Author',
      description: 'A test book created via API',
      genres: ['Fiction', 'Test']
    });
    
    const response = await makeRequest(`${baseURL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bookData)
      }
    }, bookData);
    
    const book = JSON.parse(response);
    console.log('✅ Book creation:', book.title, 'created with ID:', book._id);
  } catch (error) {
    console.log('❌ Book creation failed:', error.message);
  }
}

function makeRequest(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

testAPI(); 