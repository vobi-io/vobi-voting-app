const uCtrl = require('../controllers/users');
const multer = require('multer');

const upload = multer({  });
module.exports = function (app) {

    app.post('/login', uCtrl.login);
    app.get('/logout', uCtrl.logOut);
    app.post('/register', uCtrl.register);
    app.post('/retrieve/session', uCtrl.retrieveSession);
    app.post('/files', upload.single('file'), uCtrl.uploadFile);




};