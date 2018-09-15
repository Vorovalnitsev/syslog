const controllerMessages = require('../../syslog/controllers/records.js');



module.exports.getMessagesFromQuantity = function getMessagesFromQuantity(req, res) {
    controllerMessages.getMessagesFromQuantity(req.params.from, req.params.quantity, function (result) {
        res.send(result);
    });
}

module.exports.getMessagesByIdClientFromQuantity = function getMessagesByIdClientFromQuantity(req, res) {
    controllerMessages.getMessagesByIdClientFromQuantity(req.params.id, req.params.from, req.params.quantity,
        function (result) {
            res.send(result);
    });
}

module.exports.getMessages = function getMessages(req, res) {
        res.render('messages.handlebars');
}

