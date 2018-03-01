var mongoose = require('mongoose');
var fs = require('fs');
require('../models/question');
require('../models/option');

var Question = mongoose.model('question');
var Option = mongoose.model('option');
var Voting = mongoose.model('voting');
var Users = mongoose.model('users');

var ObjectId = require('mongodb').ObjectID;
module.exports = function (app) {

    app.post('/app/question/get', function (req, res) {

        var searchObj = {
            name: {
                '$regex': req.body.name || ""
            },
            description: {
                '$regex': req.body.description || ""
            }
        };

        if (req.body.userName) {
            Users.findOne({userName: req.body.userName}, null, function (err, user) {
                searchObj['authorId'] = {
                    '$regex': user._id
                };
                Question.find(
                    searchObj, null, {sort: 'startDate'}, function (err, question) {
                        if (err) {
                            res.json(err)
                        }
                        res.json(question);
                    });
            });
        } else {
            Question.find(
                searchObj, null, {sort: 'startDate'}, function (err, question) {
                    if (err) {
                        res.json(err)
                    }
                    res.json(question);
                });
        }

    });
    app.post('/app/question/add', function (req, res) {
        if (!req.body.name || !req.body.startDate || !req.body.endDate) {
            res.json({error: "please fill all required inputs"});
        }
        var question = new Question({
            name: req.body.name,
            created: new Date(),
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            description: req.body.description,
            authorId: req.session.userId,
            maxValues: req.body.maxValues,
            showReportInProcess:req.body.showReportInProcess || true
        });
        question.save(function (err, newQuestion) {
            if (err) {
                res.send(err);
            } else {
                return res.json(newQuestion);
            }
        });

    });
    app.post('/app/question/edit', function (req, res) {
        if (!req.body._id) {
            res.json({error: 'id is required'});
        } else {
            Question.findOne({
                _id: req.body._id
            }, null, {sort: 'name'}, function (err, question) {
                if (!question) {
                    res.json({error: 'Question not found'})
                }
                question['name'] = req.body.name || question['name'];
                question['description'] = req.body.description || question['description'];
                question['startDate'] = req.body.startDate || question['startDate'];
                question['endDate'] = req.body.endDate || question['endDate'];
                question['modified'] = new Date();
                question.save(function (err, quest) {
                    if (err) {
                        res.send(err);
                    } else {
                        return res.json(quest);
                    }
                });
            });
        }
    });
    app.post('/app/question/delete', function (req, res) {
        Question.remove({_id: req.body._id},
            function (err, result) {
                if (err) return res.json(err);
                return res.json("Question has been deleted");
            });
    });

    app.post('/app/question/option/get', function (req, res) {
        if (!req.body.questionId && !req.body.questionName) {
            res.json({error: 'question name or id required'})
        }
        var searchObj = {};

        if (req.body.questionId) {
            searchObj = {'_id': ObjectId(req.body.questionId)};
        } else if (req.body.questionName) {
            var tmp = req.body.questionName.replace(/\*/g, '?');
            searchObj = {'name': tmp.replace(/-/g, ' ')};
        }
        Question.findOne(searchObj, null, null, function (err, question) {
            if (err) {
                res.json(err)
            }
            if (question)
                Option.find({'question._id': ObjectId(question._id)}, null, null, function (err, options) {
                    if (err) {
                        res.json(err)
                    }
                    question['options'] = options;
                    res.send(question);
                });
            else res.json({error: "Question Not found"})
        });

    });
    app.post('/app/question/option/add', function (req, res) {
        if (!req.body.options || !req.body.questionId) {
            res.json({error: 'questionId and name required'})
        }
        Question.findOne({_id: req.body.questionId}, null, null, function (err, question) {
            if (err) {
                res.json(err)
            }
            if (!question) {
                res.json({error: 'active voting not found'});
            }
            var options = req.body.options;
            options.forEach(function (opt, i) {
                    var option = new Option({
                        name: opt.name,
                        question: question
                    });
                    option.save();
                    if (i == options.length - 1) {
                        res.json({status: true})
                    }
                }
            );

        });
    });
    app.post('/app/question/option/edit', function (req, res) {
        if (!req.body.options) {
            res.json({error: 'options required!'})
        }
        var options = req.body.options;

        options.forEach(function (o, i) {
            if (!o._id) {
                Question.findOne({_id: o.questionId}, null, null, function (err, question) {
                    var option = new Option({
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
            if (i == options.length - 1) {
                res.json({status: true})
            }
        });

    });
    app.post('/app/question/option/delete', function (req, res) {
        Option.remove({_id: req.body._id},
            function (err, result) {
                if (err) return res.json(err);
                return res.json("Option has been deleted");
            });
    });


    app.post('/app/question/check/authority', function (req, res) {
        Question.findOne({_id: ObjectId(req.body._id)}, null, null, function (err, question) {
            if ((question.authorId === req.session.userId) && req.session.userId) {
                res.json({success: true});
            } else{
                res.json({success: false});
            }
        });
    });
};