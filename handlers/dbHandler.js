const mongoose = require('mongoose');

async function connectToDB(uri) {
    if(!uri) {
        console.error('MongoDB URI is missing');
    }

    await mongoose.connect(uri);
    console.log(`Connected to ${uri}`);
};

module.exports = {
    connectToDB,
}