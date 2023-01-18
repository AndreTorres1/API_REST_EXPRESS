const jwt = require('jsonwebtoken');
const secretKey = 'secret';

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log(token);
        next();
    } catch (error) {
        res.status(401).send({message: 'Unauthorized'});
    }
}

module.exports = verifyToken;
