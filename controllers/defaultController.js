const index = (req, res) => {
    try {
        res.render('index', { title: 'Home' });
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    index,
}