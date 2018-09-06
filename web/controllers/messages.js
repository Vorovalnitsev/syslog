const controllerMessages = require('../../syslog/controllers/records.js');



module.exports.getMessagesFromQuantity = function getMessagesFromQuantity(req, res) {
    controllerMessages.getMessagesFromQuantity(req.params.from, req.params.quantity, function (result) {
        res.send(result);
    });
}

module.exports.getMessages = function getMessages(req, res) {
        res.render('messages.handlebars');
}

module.exports.getNotAcknowledgedMessages = function getNotAcknowledgedMessages(req, res) {
        res.render('messages.handlebars');
}

module.exports.getNotAcknowledgedMessagesFromQuantity = function getNotAcknowledgedMessagesFromQuantity(req, res) {
    controllerMessages.getNotAcknowledgedMessagesFromQuantity(req.params.from, req.params.quantity, function (result) {
        res.send(result);
    });
}

module.exports.acknowledgeMessage = function acknowledgeMessage(req, res) {
    controllerMessages.setAcknowledgeMessage(req.params.id, function (result) {
        res.send(result);
    });
}

module.exports.getNotAcknowledgedMessagesCount= function getNotAcknowledgedMessagesCount(req, res) {
    controllerMessages.getNotAcknowledgedMessagesCount(function (result) {
        res.send({count: result});
    });
}

