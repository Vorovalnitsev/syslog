const controllerMessages = require('../../syslog/controllers/records.js');

module.exports.index = function (req, res) {

            res.render('index.handlebars', {
                title: 'Syslog'});
}