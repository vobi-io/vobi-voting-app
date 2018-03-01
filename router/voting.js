const vCtrl = require('../controllers/voting');
module.exports = function (app) {
    app.post('/app/vote/get', vCtrl.voteGet);
    app.post('/app/vote/checkVoting', vCtrl.checkVoting);
    app.post('/app/vote', vCtrl.vote);
    app.post('/app/vote/chartData', vCtrl.chartData);

};