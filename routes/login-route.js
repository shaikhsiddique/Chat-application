const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const {userModel,validateUserModel} = require('../models/user-model');
const generateToken = require('../utils/generate-token');


route.get('/',(req,res)=>{
    res.render('login.ejs');
});

route.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send("Invalid password");
        }
        
        const token = generateToken(user._id);

        res.cookie("token", token, {
            expires: new Date(Date.now() + 3600000 * 24 * 30),
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        
        res.redirect('/'); // Redirect to home or another page
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = route;