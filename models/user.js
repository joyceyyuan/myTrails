const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    googleId: {
        type: String,
        required: true
    },
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
