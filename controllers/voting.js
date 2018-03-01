const Voting = require('../models/voting');

module.exports = {
    voteGet: async function (req, res) {
        let searchObj = {};
        let body = req.body;
        if (body.questionId) {
            searchObj['questionId'] = body.questionId;
        }
        if (body.optionId) {
            searchObj['optionId'] = body.optionId;
        }
        Voting.find(searchObj, null, {sort: 'name'}, function (err, votings) {
            (err)?res.send(err):res.json(votings);
        })
    },
    checkVoting: async function (req, res) {
        let body =  req.body;
        if (req.session.userId) {
            if (!body._id) {
                res.json({error: "Question Id Required"});
            }
            Voting.find({questionId: body._id, userId: req.session.userId}, null, null, function (err, vote) {
                (err)?res.json(err):res.json(vote);
            });
        } else {
            res.json({error: "Session Required"});
        }
    },
    vote: async function (req, res) {
        if (!req.session.userId) {
            res.json({error: "You Are Not Logged in!"})
        } else if (!req.body.options || !req.body.questionId) {
            res.json({error: "Please Fill All Required Inputs"});
        } else {
            let options = req.body.options;
            options.forEach(function (opt, i) {
                let voting = new Voting({
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
    },
    chartData: async function (req, res) {
        if (!req.body._id) {
            res.json({error: 'Question Id Required'})
        }
        let bodyOptions = req.body.options;
        await  Voting.find({questionId: req.body._id}, null, null, function (err, voting) {
            if (err) {
                res.json(err);
            }
            let result = [];
            if (voting.length < 1) {
                res.json({chartData: result})
            }
            let allVotes = voting.length;
            if (bodyOptions) {
                bodyOptions.forEach(function (opt, i) {
                    Voting.findOne({optionId: opt._id}, null, null, function (err, votings) {
                        if (err) {
                            res.json(err);
                        }
                        let length = 0;
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
                    });
                });
            }else {
                res.json({error: "options not found"});
            }
        });
    },

};