const express = require('express');
const dbHandler = require('./handlers/dbHandler');
const defaultRoutes = require('./routes/defaultRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(3000, async () => {
    await dbHandler.connectToDB(
        'mongodb://10.12.11.110:27017/tverrfagligQuotes'
    )
    console.info('app started @ localhost 3000!');
});

app.use('/', defaultRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: 'error 404' });
});