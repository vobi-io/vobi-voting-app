var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var votingSchema = new Schema({
   questionId:String,
   optionId:String,
   userId:String,
   createdAt:Date
});
var Voting = mongoose.model('voting', votingSchema);
