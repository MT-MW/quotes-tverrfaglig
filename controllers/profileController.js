const { User, verifyPassword } = require('../models/user');
const jwt = require('jsonwebtoken');

const signupGET = (req, res) => {
    if(req.cookies?.flash) {
        const message = req.cookies.flash;
        res.clearCookie('flash');
        res.render('sign-up', {flash: {message: message, type: 'error'}});
        return;
    }
    res.render('sign-up', {flash: null});
};

const signupPOST = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        createFlashCookie(res, 'Your passwords do not match');
        res.redirect('/sign-up');
        return;
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            createFlashCookie(res, 'That username already exists');
            res.redirect('/sign-up');
            return;
        }

        const newUser = new User({ username, password });
        await newUser.save();
        console.info(`User ${username} saved to database.`);
        res.redirect('/home');
    } catch (err) {
        console.error('Error during signup:', err);
        res.redirect('/sign-up');
    }
};

const loginGET = (req, res) => {
    if(req.cookies?.flash) {
        const message = req.cookies.flash;
        res.clearCookie('flash');
        res.render('login', {flash: {message: message, type: 'error'}});
        return;
    }
    res.render('login', {flash: null});
};

const loginPOST = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});
        if (!user) {
            createFlashCookie(res, 'Invalid username or password');
            return res.redirect('/log-in');
        }

        const isValid = await verifyPassword(user, password);
        if(!isValid) {
            createFlashCookie(res, 'Invalid username or password');
            return res.redirect('/log-in');
        }

        const token = jwt.sign(
            {id: user._id}, 
            'your_jwt_secret', 
            {expiresIn: '5m'}
        );
        res.cookie('accessToken', token, {
            httpOnly: true, 
            sameSite: 'strict'
        });

        return res.redirect('/home');

    }catch (error) {
        console.error('Error during sign-in:', error);
        createFlashCookie(res, 'An internal error occurred. Please try again.');
        res.redirect('/log-in');
        return;
    }

};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.redirect('/log-in');
}

function createFlashCookie(res, message) {
    console.log("Creating flash cookie with message:", message);
    res.cookie('flash', message, {httpOnly: true, sameSite: 'strict',maxAge: 5000});
}


module.exports = {
    signupGET,
    signupPOST,
    loginGET,
    loginPOST,
    logout,
}
