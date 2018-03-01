var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var optionsSchema = new Schema({
    name: String,
    question: Object,
    selected: Boolean

});
module.exports=  mongoose.model('option', optionsSchema);
