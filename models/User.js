const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }, // Hashed version of the user's login password
    aesKeyHash: { type: String, required: true }, // Hashed version of the user's AES key
});

const User = mongoose.model('User', userSchema);
module.exports = User;
