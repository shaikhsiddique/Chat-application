const express = require('express');
const route = express.Router();
const { userModel, validateUserModel } = require('../models/user-model');
const hashPassword = require('../utils/generate-salt');
const generateToken = require('../utils/generate-token');

route.get('/', (req, res) => {
    res.render('signup.ejs');
});

route.post('/', async (req, res) => {
    console.log('POST /signup route hit');
    const { username, email, password } = req.body;

    // Validate user data
    const { error } = validateUserModel({ username, email, password });
    if (error) {
        console.log('Validation error:', error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    // Create new user
    try {
        const hashedPassword = await hashPassword(password); // Await the hashPassword function
        const user = await userModel.create({ username, email, password: hashedPassword });
        const token = generateToken(user._id);

        res.cookie("token", token, {
            expires: new Date(Date.now() + 3600000 * 24 * 30),
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        
        res.redirect('/');
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = route;
