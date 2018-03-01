var mongoose = require('mongoose');
var fs = require('fs');
require('../models/voting');

var Voting = mongoose.model('voting');
var ObjectId = require('mongodb').ObjectID;
module.exports = function (app) {
    app.post('/app/vote/get', function (req, res) {
        var searchObj = {};
        if (req.body.questionId) {
            searchObj['questionId'] = req.body.questionId;
        }
        if (req.body.optionId) {
            searchObj['optionId'] = req.body.optionId;
        }
        Voting.find(searchObj, null, {sort: 'name'}, function (err, votings) {
            if (err) {
                res.send(err);
            } else {
                return res.json(votings);
            }
        })
    });
    app.post('/app/vote/checkVoting', function (req, res) {

        if (req.session.userId) {

            if (!req.body._id) {
                res.json({error: "Question Id Required"});
            } else {
                var searchObj = {
                    questionId: {
                        '$regex': req.body._id
                    },
                    userId: {
                        '$regex': req.session.userId
                    }
                };
                Voting.find({
                    questionId: req.body._id,
                    userId: req.session.userId
                }, null, null, function (err, vote) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(vote)
                    }

                });
            }
        } else {
            res.json({error: "Session Required"});
        }
    });

    app.post('/app/vote', function (req, res) {
        if (!req.session.userId) {
            res.json({error: "You Are Not Logged in!"})
        } else if (!req.body.options || !req.body.questionId) {
            res.json({error: "please fill all required inputs"});
        } else {
            var options = req.body.options;
            options.forEach(function (opt, i) {
                var voting = new Voting({
                    questionId: req.body.questionId,
                    optionId: opt._id,
                    userId: req.session.userId
                });
                voting.save();
                if (i === options.length - 1) {
                    res.json({success: true})
                }
            });

        }
    });

    app.post('/app/vote/chartData', function (req, res) {
        if (!req.body._id) {
            res.json({error: 'Question id required'})
        } else {
            var bodyOptions = req.body.options;

            Voting.find({questionId: req.body._id}, null, null, function (err, voting) {
                if (err) {
                    res.json(err);
                } else {
                    var result = [];
                    if (voting.length < 1) {
                        res.json({chartData: result})
                    }
                    var allVotes = voting.length;
                    if (bodyOptions) {
                        bodyOptions.forEach(function (opt, i) {
                            Voting.findOne({
                                optionId: opt._id
                            }, null, null, function (err, votings) {
                                if (err) {
                                    res.json(err);
                                } else {
                                    var length = 0;
                                    if (votings) {
                                        if (Array.isArray(votings)) {
                                            length = votings.length;
                                        } else {
                                            length = 1;
                                        }
                                    }
                                    result.push({
                                        label: opt.name,
                                        value: length / allVotes * 100
                                    });

                                    if (i === bodyOptions.length - 1) {

                                        res.json({chartData: result})
                                    }

                                }
                            });
                        });
                    } else {
                        res.json({error: "options not found"});
                    }
                }
            });

        }
    });

};