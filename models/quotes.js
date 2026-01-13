const mongoose = require("mongoose");

const quoteSchema= new mongoose.schema({
    quote: {
        type: String,
        required: true,
        maxlength: 100,
        
    },
    quoteOrigin: {
        type: String,
        required: true,
    }
});

const Quote = mongoose.model('Quote', quoteSchema, 'quotes');

module.exports = {
    Quote,
};