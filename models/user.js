const mongoose = require('mongoose');
const argon2 = require('argon2');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String, 
        required: [true, 'Please enter a username'], 
        unique: true
    },
    password: {
        type: String, 
        required: [true, 'Please enter a password'],
    }
});

userSchema.pre('save', async function () {
    try {
        if (!this.isModified('password')) return;

        const hash = await argon2.hash(this.password);
        this.password = hash;
    } catch (err) {
        console.error(err);
    }
});

async function verifyPassword(user, enteredPassword) {
    try {
        return await argon2.verify(user.password, enteredPassword);
    } catch (err) {
        console.error(err)
    }
}

const User = mongoose.model('User', userSchema, 'users');

module.exports = {
    User,
    verifyPassword,
};