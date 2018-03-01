var mongoose = require('mongoose');
var md5 = require('crypto-md5');
require('../models/users');
var Users = mongoose.model('users');
var fs = require('fs');
var sess;
var multer = require('multer');
const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`);
    }
});
const upload = multer({  });
module.exports = function (app) {

    app.post('/files', upload.single('file'), (req, res) => {
        const file = req.file;
        if (file) {
            fs.writeFile("./public/vote/dist/" + file.originalname, file.buffer, "binary", function (err, r) {
                console.log(err);

                res.json({filePath:file.originalname})
            });

        } else {
            res.json({error:"Nothing happened"})
        }
    });

    app.post('/retrieve/session', function (req, res) {
        if (!req.session.userName) {
            res.json({error:"session not found"});
        }
        else {
            res.json(req.session);
        }
    });

    app.post('/login', [function (req, res, next) {
        next();
    }, function (req, res) {
        if (!req.body.userName || !req.body.password) {
            res.json({error:"incorrect UserName or Password"});
        }
        else {
            Users.findOne({userName: req.body.userName}, function (err, user) {
                if (err) {
                    res.json(err);
                }
                else {
                    if (user && user.password === md5(req.body.password, 'hex')) {
                        sess = req.session;
                        sess.userName = user.userName;
                        sess.firstName = user.firstName;
                        sess.lastName = user.lastName;
                        sess.photo = user.photo;
                        sess.userId = user._id;
                        sess.save(function () {
                            res.json(sess);
                        });
                    }
                    else {
                        res.json({error:"incorrect UserName or Password"});
                    }
                }
            });
        }

    }]);
    app.get('/logout', function (req, res) {
        if (req.session && req.session.userName) {
            req.session.destroy();
            res.json({user:{}});
        }
        else {
            res.redirect('/');
        }
    });
    app.post('/register/',  function (req, res) {
        Users.findOne({userName: req.body.userName}, function (err, user) {
            if (err) {
                res.json(err);
                return;
            }
            if (user) {
                res.json({error:'User Name Already Exists'});
                return;
            }

            var newUser = new Users({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
                email: req.body.email,
                pid: req.body.userName,
                created: new Date(),
                photo: req.body.file,
                activated: req.body.userName,
                password: md5(req.body.password, 'hex')
            });
            newUser.save(function (err, newUser) {
                if (err) {
                    res.json(err);
                } else {
                    res.json({success:'true'});
                }
            });
        });


    });

};
