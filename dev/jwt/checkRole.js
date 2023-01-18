const jwt = require('jsonwebtoken');
const db = require('../database');
const secret = 'secret'

function checkUserRole(requiredRole) {
    return (req, res, next) => {
        const token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    if (err.name === "JsonWebTokenError") {
                        return res.status(401).json({message: 'Invalid token'});
                    }
                    console.log(err);
                    return res.status(401).json({error: 'Upss not working :^('});
                }
                //decoded representa toda a informacao do user do token dado
                req.decoded = decoded;
                const id = decoded.id
                db.query(`SELECT role
                                               FROM users
                                               WHERE id = $1`, [id], (err,result) => {
                    if (err) return res.status(401).json({error: 'upss not working :^('});
                    if (result && result.rows && result.rows.length > 0) {
                        const user = result.rows[0];
                        if (req.decoded.role === requiredRole) {
                            return next();
                        }
                        return res.status(403).json({error: 'Unauthorized'});
                    }
                    return res.status(404).json({error: "User not found"});
                });
            });
        } else {
            return res.status(401).json({message: 'No token given'});
        }
    }
}

module.exports = checkUserRole;
