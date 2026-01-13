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
        console.log(err);
    }
};

module.exports = {
    index,
};