const mongoose = require('mongoose');
require('dotenv').config();

try {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    module.exports = db;
} catch (error) {
    console.error('Error in connecting to MongoDB:', error.message);
}


