let mongoose = require('mongoose');

// Add Validators !!!
let userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
})

module.exports = mongoose.model('User', userSchema);