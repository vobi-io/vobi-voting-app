const qCtrl = require('../controllers/question');


module.exports = function (app) {

    app.get('/',function(req,res){
        res.render('index')
    });
    app.post('/app/question/get', qCtrl.questionGet);
    app.post('/app/question/add', qCtrl.questionAdd);
    app.post('/app/question/edit', qCtrl.questionEdit);
    app.post('/app/question/delete', qCtrl.questionDelete);

    app.post('/app/question/option/get', qCtrl.questionOptionGet);
    app.post('/app/question/option/add', qCtrl.questionOptionAdd);
    app.post('/app/question/option/edit', qCtrl.questionOptionEdit);
    app.post('/app/question/option/delete', qCtrl.questionOptionDelete);

    app.post('/app/question/check/authority', qCtrl.questionCheckAuthority);



};