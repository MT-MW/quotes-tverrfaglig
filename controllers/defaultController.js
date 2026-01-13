const { User } = require('../models/user');

const index = async (req, res) => {
    try {
        let user = null;
        if (req.auth) {
            user = await User.findById(req.auth.id);
        }
        res.render('index', { user, title: 'All quotes' });
    } catch(err) {
        console.log(err);
    }
};

module.exports = {
    index,
};