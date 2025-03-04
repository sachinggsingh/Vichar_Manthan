// Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const mongo = require('mongodb');
dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');


// Routes
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const Blog = require('./models/blog');

// Middleware
const checkForAuthenticationCookie = require('./middleware/authentication');


// Server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
// app.use(express.static(path.resolve('./public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join('views'));

const PORT =process.env.PORT || 8000;


// Database
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));

// Routes
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('home', {user: req.user, blog : allBlogs});
})
app.use('/user', userRoute);
app.use('/blog', blogRoute);


// Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));