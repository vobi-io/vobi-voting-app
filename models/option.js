var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionsSchema = new Schema({
    name: String,
    question: Object,
    selected: Boolean

});
var Option = mongoose.model('option', optionsSchema);
