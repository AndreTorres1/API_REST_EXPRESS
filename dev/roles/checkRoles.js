const db = require('../database')
const jwt = require('jsonwebtoken');
const secretKey = 'secret';

const checkAuthorization = (requiredRole) => (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const {payload} = jwt.verify(token, secret);
        const {id} = payload;
        const {role} = db.query(`SELECT role
                                 FROM users
                                 WHERE id = ${id}`);

        if (role === requiredRole) {
            return next();
        }

        return res.status(403).json({error: 'Unauthorized'});
    } catch (err) {
        // Return an error if the token is invalid
        return res.status(401).json({error: 'Invalid token'});
    }
};

module.exports = checkAuthorization;