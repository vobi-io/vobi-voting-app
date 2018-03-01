const Question = require('../models/question');
const Option = require('../models/option');
const Users = require('../models/users');
const ObjectId = require('mongodb').ObjectID;
module.exports = {
    questionGet: async function (req, res) {
        let body = req.body;
        let searchObj = {
            name: {
                '$regex': body.name || ""
            },
            description: {
                '$regex': body.description || ""
            }
        };
        if (body.userName) {
            await Users.findOne({userName: body.userName}, null, function (err, user) {
                if (user) {
                    searchObj['authorId'] = {
                        '$regex': user._id
                    };
                } else {
                    searchObj['authorId'] = 'notFound';
                }

            });
            await  Question.find(searchObj, null, {sort: 'startDate'}, function (err, question) {
                (err) ? res.json(err) : res.json(question);
            });
        } else {
            await Question.find(searchObj, null, {sort: 'startDate'}, function (err, question) {
                (err) ? res.json(err) : res.json(question);
            });
        }
    },
    questionAdd: async function (req, res) {
        let body = req.body;
        if (!body.name || !body.startDate || !body.endDate) {
            res.json({error: "Please Fill All Required Inputs"});
        }
        let question = new Question({
            name: req.body.name,
            created: new Date(),
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description,
            authorId: req.session.userId,
            maxValues: req.body.maxValues,
            showReportInProcess: req.body.showReportInProcess || true
        });
        question.save(function (err, newQuestion) {
            (err) ? res.send(err) : res.json(newQuestion);
        });

    },
    questionEdit: async function (req, res) {
        let body = req.body;
        if (!body._id) {
            res.json({error: 'Id Is Required'});
        }
        await Question.findOne({_id: ObjectId(body._id)}, null, {sort: 'name'}, function (err, question) {
            if (!question) {
                res.json({error: 'Question not found'})
            }
            question['name'] = body.name || question['name'];
            question['description'] = body.description || question['description'];
            question['startDate'] = body.startDate || question['startDate'];
            question['endDate'] = body.endDate || question['endDate'];
            question['modified'] = new Date();
            question.save(function (err, quest) {
                (err) ? res.send(err) : res.json(quest);
            });
        });

    },
    questionDelete: async function(req, res){
       Question.remove({_id: ObjectId(req.body._id)}, function (err, result) {
                (err)?res.json(err): res.json("Question has been deleted");
            });
    },

    questionOptionGet:async function (req, res){
        let body= req.body;
        if (!body.questionId && !body.questionName) {
            res.json({error: 'question name or id required'})
        }
        let searchObj = {};

        if (body.questionId) {
            searchObj = {'_id': ObjectId(req.body.questionId)};
        } else if (body.questionName) {
            let tmp = req.body.questionName.replace(/\*/g, '?');
            searchObj = {'name': tmp.replace(/-/g, ' ')};
        }
        let question = await Question.findOne(searchObj, null, null, function (err, question) {});
        if (question)
            Option.find({'question._id': ObjectId(question._id)}, null, null, function (err, options) {
                if (err) {
                    res.json(err)
                }
                question['options'] = options;
                res.send(question);
            });
        else res.json({error: "Question Not found"});
    },
    questionOptionAdd:async function(req, res){
        let body = req.body;
        if (!body.options || !body.questionId) {
            res.json({error: 'QuestionId And Name Required'})
        }
       await Question.findOne({_id: req.body.questionId}, null, null, function (err, question) {
            if (err) {
                res.json(err)
            }
            if (!question) {
                res.json({error: 'active voting not found'});
            }
            let options = req.body.options;
            options.forEach(function (opt, i) {
                    let option = new Option({
                        name: opt.name,
                        question: question
                    });
                    option.save();
                    if (i === options.length - 1) {
                        res.json({status: true})
                    }
                }
            );

        });
    },
    questionOptionEdit: async function(req, res){
        if (!req.body.options) {
            res.json({error: 'options required!'})
        }
        let options = req.body.options;
          options.forEach(await function (o, i) {
            if (!o._id) {
               Question.findOne({_id: o.questionId}, null, null, function (err, question) {
                    let option = new Option({
                        name: o.name,
                        question: question
                    });
                    option.save();
                });
            } else {
                Option.findOne({_id: ObjectId(o._id)}, null, null, function (err, opt) {
                    if (!opt) {
                        return;
                    }
                    opt['name'] = o.name || opt['name'];
                    opt.save();
                });
            }
            if (i === options.length - 1) {
                res.json({status: true})
            }
        });
    },
    questionOptionDelete: async function(req, res){
        Option.remove({_id: ObjectId(req.body._id)}, function (err, result) {
               (err)?res.json(err): res.json("Option Has Been Deleted");
            });
    },

    questionCheckAuthority: async function(req, res){
        Question.findOne({_id: ObjectId(req.body._id)}, null, null, function (err, question) {
            if ((question.authorId === req.session.userId) && req.session.userId) {
                res.json({success: true});
            } else{
                res.json({success: false});
            }
        });
    }

};
