require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const BookSchema = new mongoose.Schema({
    sno: { type: Number, required: true, unique: true },
    booktitle: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    yop: { type: Date, required: true }, 
    isbn: { type: String, required: true }
});

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    books: [BookSchema]
});

// User Model
const User = mongoose.model('User', UserSchema);

// API Endpoints
app.get('https://donate-a-book-u6j2.onrender.com/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('https://donate-a-book-u6j2.onrender.com/api/users', async (req, res) => {
    const { name, phone, email, books } = req.body;

    // Validate input
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!/^\d{10}$/.test(phone)) errors.phone = 'Valid phone number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email address is required';

    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        // Check for existing user
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            // Update existing user
            existingUser.books = [...existingUser.books, ...books]; // Add new books if any
            await existingUser.save();
            return res.status(200).json(existingUser);
        }

        // Create a new user if not found
        const newUser = new User({ name, phone, email, books });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update User Endpoint
app.put('https://donate-a-book-u6j2.onrender.com/api/users/:id', async (req, res) => {
    const { name, phone, email, books } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, phone, email, books },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('https://donate-a-book-u6j2.onrender.com/api/users/:userId/books/:bookId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookId = req.params.bookId;

        // Find the user and remove the book
        const user = await User.findById(userId);
        user.books = user.books.filter(book => book._id.toString() !== bookId);

        // Reassign serial numbers
        user.books.forEach((book, index) => {
            book.sno = index + 1; // Reassign sno based on the index
        });

        // Save updated user
        await user.save();

        res.status(200).json({ message: "Book deleted successfully", user });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the book" });
    }
});


// Endpoint to dump the state
app.get('https://donate-a-book-u6j2.onrender.com/api/state', async (req, res) => {
    try {
        const users = await User.find();
        const state = users.map(user => {
            // Reassign sno values based on the current books array
            return {
                name: user.name,
                phone: user.phone,
                email: user.email,
                books: user.books.map((book, index) => ({
                    sno: index + 1, // Auto-incrementing number based on index
                    booktitle: book.booktitle,
                    author: book.author,
                    genre: book.genre,
                    yop: book.yop,
                    isbn: book.isbn
                }))
            };
        });
        res.json(state);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch state' });
    }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
