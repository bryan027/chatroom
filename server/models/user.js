const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: String,
    sport: String,
}, { timestamps: true });

const usermodel = mongoose.model('user_prfile', User);

module.exports = usermodel;