const controllerMessages = require('../../syslog/controllers/records.js');



module.exports.getMessagesFromQuantity = function getMessagesFromQuantity(req, res) {
    controllerMessages.getMessagesFromQuantity(req.params.from, req.params.quantity, function (result) {        
        if (result.length > 0){
            res.status(200);
            res.send(result);
        }
            else {
                res.status(404);
                res.send();
            }
    });
}

module.exports.getMessagesQuantity = function getMessagesQuantity(req, res) {
    controllerMessages.getMessagesQuantity(function (result) {        
        if (result){
            res.status(200);
            res.send(result);
        }
            else {
                res.status(404);
                res.send();
            }
    });
}

module.exports.getMessagesByIdClientFromQuantity = function getMessagesByIdClientFromQuantity(req, res) {
    controllerMessages.getMessagesByIdClientFromQuantity(req.params.id, req.params.from, req.params.quantity,
        function (result) {
            if (result.length > 0){
                res.status(200);
                res.send(result);
            }
                else {
                    res.status(404);
                    res.send();
                }
    });
}

module.exports.getMessagesByIdClientQuantity = function getMessagesByIdClientQuantity(req, res) {    
    controllerMessages.getMessagesByIdClientQuantity(req.params.id,
        function (result) {
            if (result){
                res.status(200);
                res.send(result);
            }
                else {
                    res.status(404);
                    res.send();
                }
    });
}

module.exports.getMessages = function getMessages(req, res) {
    controllerMessages.getMessages(function (result) {
        res.send(result);
    });
}

//возвращаем сообщение по id
module.exports.getMessageById = function getMessageById(req,res){
    controllerMessages.getMessageById(req.params.id, function (result) {
        if (result){
            res.status(200);
            res.send(result);
        }
            else {
                res.status(404);
                res.send();
            }
    });
}
