const mongoose = require("mongoose");

const quoteSchema= new mongoose.schema({
    quote: {
        type: String,
        required: [true, 'Please enter a quote'],
        maxlength: 100,
        
    },
    quoteOrigin: {
        type: String,
        required: [true, 'Please enter a origin for the quote'],
    }
});

const Quote = mongoose.model('Quote', quoteSchema, 'quotes');

module.exports = {
    Quote,
};