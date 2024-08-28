const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    account: { type: String, required: true }, // e.g., 'Google'
    username: { type: String, required: true }, // e.g., 'user@gmail.com'
    encryptedPassword: { type: String, required: true }, // AES encrypted password
    iv: { type: String, required: true }, // Initialization Vector
});

const Password = mongoose.model('Password', passwordSchema);
module.exports = Password;
