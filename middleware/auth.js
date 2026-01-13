const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    console.info('Authenticating user...');
    const token = req.cookies?.accessToken;
    if (!token) {
        console.warn('No access token found. Redirecting to login.');
        return res.redirect('/log-in');
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.auth = decoded;
        console.info('User authenticated successfully.');
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.redirect('/log-in');
    }
}

const optionalAuthenticate = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (token) {
        jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
            if (!err) {
                req.auth = decoded;
            }
        });
    }
    next();
}

module.exports = {
    authenticate,
    optionalAuthenticate
}