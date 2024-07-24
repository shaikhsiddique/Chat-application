const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token; 
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded.id; 
            next();
        } catch (err) {
            res.redirect('/login'); 
        }
    } else {
        res.redirect('/login'); 
    }
};

module.exports = isLoggedIn;
