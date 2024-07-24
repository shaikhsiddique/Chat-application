const express = require('express');
const route = express.Router();

route.get('/',(req,res)=>{
    res.cookie('token',null);
    res.redirect('/')
})

module.exports = route;