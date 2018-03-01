const Users = require('../models/users');
const fs = require('fs');
const md5 = require('crypto-md5');
let sess;
module.exports={
    register: async function (req, res) {
        Users.findOne({userName: req.body.userName}, function (err, user) {
            if (err) {
                res.json(err);
            }
            if (user) {
                res.json({error:'User Name Already Exists'});
            }
            let newUser = new Users({
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
                (err)? res.json(err):res.json({success:'true'});
            });
        });

    },
    logOut: async function(req, res){
        if (req.session && req.session.userName) {
            req.session.destroy();
            res.json({user:{}});
        }
        else {
            res.redirect('/');
        }
    },
    login:  function(req, res){

        if (!req.body.userName || !req.body.password) {
            res.json({error:"Required UserName And Password"});
        }

        Users.findOne({userName: req.body.userName}, function (err, user) {
            if (err) {
                res.json(err);
            }

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
            } else {
                res.json({error:"incorrect UserName or Password"});
            }

        });

    },
    retrieveSession: function(req, res){
        (!req.session.userName)?res.json({error:"session not found"}):res.json(req.session);
    },
    uploadFile: async function(req, res){
        const file = req.file;
        if (file) {
            fs.writeFile("./public/vote/dist/" + file.originalname, file.buffer, "binary", function (err) {
                console.log(err);
                res.json({filePath:file.originalname})
            });

        }
        res.json({error:"Nothing happened"})
    }
};