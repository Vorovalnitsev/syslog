const controllerMessages = require('../../syslog/controllers/records.js');

module.exports.index = function (req, res) {
    controllerMessages.getCountNotAcknowledgedMessages(function (countNotAcknowledgedMessages) {

        controllerMessages.getCountNotAcknowledgedClients(function (countNotAcknowledgedClients) {
            res.render('index.handlebars', {
                title: 'Syslog',
                countNotAcknowledgedMessages: countNotAcknowledgedMessages,
                countNotAcknowledgedClients: countNotAcknowledgedClients
            });
        });
    })

}