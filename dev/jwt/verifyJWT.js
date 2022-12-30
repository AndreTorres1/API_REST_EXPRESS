const jwt = require('jsonwebtoken');
const secretKey = 'secret';
function verifyToken(req, res, next) {
    // Extract the token from the request header
    const token = req.headers['x-access-token'];

    // Verify the token
    try {
        const decoded = jwt.verify(token, secretKey);
console.log(token);
        next();
    } catch (error) {
        // Token is invalid or has expired
        res.status(401).send({ message: 'Unauthorized' });
    }
}

module.exports = verifyToken;
