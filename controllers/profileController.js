const { User, verifyPassword } = require('../models/user');
const { Quote } = require('../models/quotes');
const jwt = require('jsonwebtoken');

const signupGET = (req, res) => {
    if(req.cookies?.flash) {
        const message = req.cookies.flash;
        res.clearCookie('flash');
        res.render('sign-up', {flash: {message: message, type: 'error'}, title: 'Sign up'});
        return;
    }
    res.render('sign-up', {flash: null, title: 'Sign up'});
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

        const token = jwt.sign(
            {id: newUser._id}, 
            'your_jwt_secret', 
            {expiresIn: '5m'}
        );
        res.cookie('accessToken', token, {
            httpOnly: true, 
            sameSite: 'strict'
        });

        res.redirect(`/home/${username}`);
    } catch (err) {
        console.error('Error during signup:', err);
        res.redirect('/sign-up');
    }
};

const loginGET = (req, res) => {
    if(req.cookies?.flash) {
        const message = req.cookies.flash;
        res.clearCookie('flash');
        res.render('login', {flash: {message: message, type: 'error'}, title: 'Log in'});
        return;
    }
    res.render('login', { flash: null, title: 'Log in' });
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

        console.log('Login successful, redirecting to:', `/home/${user.username}`);
        return res.redirect(`/home/${user.username}`);

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
};

const deleteUser = async (req, res) => {
    try {
        const userToDelete = req.auth.id;

        await Quote.deleteMany({ user: userToDelete });
        await User.findByIdAndDelete(userToDelete);

        res.clearCookie('accessToken');
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
}

const home = async (req, res) => {
    let flash = null;
    if (req.cookies?.flash) {
        const message = req.cookies.flash;
        res.clearCookie('flash');
        flash = { message, type: 'error' };
    }

    try {
        const loggedInUser = await User.findById(req.auth.id);

        if (loggedInUser.username !== req.params.username) {
            createFlashCookie(res, 'You do not have access to this page. Redirecting to your homepage.');
            return res.redirect(`/home/${loggedInUser.username}`);
        }

        const quotes = await Quote.find({ user: loggedInUser.id });

        res.render('home', { 
            user: loggedInUser, 
            title: 'Home',
            quotes,
            flash,  
        });
    } catch (err) {
        console.error('Error in home controller:', err);
        res.status(500).render('404', { title: 'Error' });
    }
};

const createQuote = async (req, res) => {
    try{
        const loggedInUser = await User.findById(req.auth.id);
        const quote = new Quote({
            quote: req.body.newQuote,
            quoteOrigin: req.body.quoteOrigin,
            user: loggedInUser._id
        });

        if(!quote.quote) {
            createFlashCookie(res, 'You need to enter a quote');
            return res.redirect(`/home/${loggedInUser.username}`);
        }

        if(quote.quote.length > 100) {
            createFlashCookie(res, 'Your quote cant be more than 100 characters');
            return res.redirect(`/home/${loggedInUser.username}`);
        }

        if(!quote.quoteOrigin) {
            createFlashCookie(res, 'You need to enter a origin for your quote');
            return res.redirect(`/home/${loggedInUser.username}`);
        }        

        await quote.save()
        res.redirect(`/home/${loggedInUser.username}`);

    } catch(err) {
        console.error(err);
    }
}

function createFlashCookie(res, message) {
    console.log("Creating flash cookie with message:", message);
    res.cookie('flash', message, {httpOnly: true, sameSite: 'strict', maxAge: 30000});
}


module.exports = {
    signupGET,
    signupPOST,
    loginGET,
    loginPOST,
    logout,
    deleteUser,
    home,
    createQuote
}
