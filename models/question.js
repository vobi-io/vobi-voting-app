var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = new Schema({
    name: String,
    created: Date,
    modified: Date,
    description: String,
    startDate: Date,
    endDate: Date,
    authorId:String,
    options:Object,
    maxValues:Number,
    showReportInProcess:Boolean

});
var Question = mongoose.model('question', questionSchema);
