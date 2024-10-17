// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect('mongodb+srv://user134:AVVQEbaGnOsMZNHc@cluster0.2mpjwi7.mongodb.net/')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Book Schema
const BookSchema = new mongoose.Schema({
    sno: Number,
    booktitle: String,
    author: String,
    genre: String,
    yop: String,
    isbn: String
});

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    books: [BookSchema]
});

// User Model
const User = mongoose.model('User', UserSchema);

// API Endpoints
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

app.post('/api/users', async (req, res) => {
    const { name, phone, email, books } = req.body;


    // Validate input
    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!/^\d{10}$/.test(phone)) errors.phone = 'Valid phone number is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email address is required';

    if (Object.keys(errors).length) return res.status(400).json(errors);

    try {
        const newUser = new User({ name, phone, email, books });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Endpoint to dump the state
app.get('/api/state', async (req, res) => {
    const users = await User.find();
    const state = users.map(user => ({
        name: user.name,
        phone: user.phone,
        email: user.email,
        books: user.books.map((book, index) => ({
            sno: index + 1, // Auto-incrementing number
            booktitle: book.booktitle,
            author: book.author,
            genre: book.genre,
            yop: book.yop,
            isbn: book.isbn
        }))
    }));
    res.json(state);
});

// Start the Server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});