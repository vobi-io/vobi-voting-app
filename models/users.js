var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    photo: String,
    pid: String,
    created: Date,
    activated: String,
    password: String,
    tmpPassword: String

});

var Users = mongoose.model('users', userSchema);

