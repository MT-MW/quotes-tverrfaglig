const { User } = require('../models/user');
const { Quote } = require('../models/quotes');

const index = async (req, res) => {
    try {
        const [quote] = await Quote.aggregate([
            { $sample: { size: 1 } }
        ]);

        let user = null;
        if (req.auth) {
            user = await User.findById(req.auth.id);
        }

        res.render('index', { 
            user, 
            title: 'All quotes',
            quote: quote || null,
        });
    } catch(err) {
        console.error(err);
    }
};

const faq = async (req, res) => {
    try {
        let user = null;
        if (req.auth) {
            user = await User.findById(req.auth.id);
        }

        res.render('faq', {user, title: 'faq'});
    } catch(err) {
        console.error(err)
    }
}

const userQuotes = async (req, res) => {
    try {
        const username = req.params.username;

        const profileUser = await User.findOne({ username });

        if(!profileUser) {
            return res.status(404).render('404', {title: 'error 404'});
        }

        const quotes = await Quote.find({ user: profileUser._id });

        let loggedInUser = null;
        if (req.auth) {
            loggedInUser = await User.findById(req.auth.id);
        }

        res.render('userQuotes', {
            title: `${username}'s quotes`,
            user: loggedInUser,
            profileUser,
            quotes,
        });
    } catch(err) {
        console.error(err);
        res.status(500).render('404', { title: 'Error' });
    }
};

module.exports = {
    index,
    faq,
    userQuotes,
};