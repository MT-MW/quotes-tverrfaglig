const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const quoteSchema= new Schema({
    quote: {
        type: String,
        required: true,
        maxlength: 100,
        
    },
    quoteOrigin: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Quote = mongoose.model('Quote', quoteSchema, 'quotes');

module.exports = {
    Quote,
};