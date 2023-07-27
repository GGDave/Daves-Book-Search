// Step 1: Create a new file (e.g., bookModel.js)

// Step 2: Require Mongoose
const mongoose = require('mongoose');

// Step 3: Define the Mongoose Schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// Step 4: Create the Mongoose model
const Book = mongoose.model('Book', bookSchema);

// Step 5: Export the model
module.exports = Book;

