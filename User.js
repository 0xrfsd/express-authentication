let mongoose = require('mongoose');

// Add Validators !!!
let userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    senha: {
        type: String,
    },
})

module.exports = mongoose.model('User', userSchema);