const controllerClients = require('../../syslog/controllers/records.js');


module.exports.getClients = function getClients(req, res) {
    res.render('clients.handlebars');
}

module.exports.getNotAcknowledgedClients = function getClients(req, res) {
    res.render('clients.handlebars');
}

//возвращаем клиентов с позиции - количество
module.exports.getClientsFromQuantity = function getClientsFromQuantity(req,res){
    controllerClients.getClientsFromQuantity(req.params.from, req.params.quantity, function (result) {
        res.send(result);
    });
}


//возвращаем клиента по id
module.exports.getClientById = function getClient(req,res){
    controllerClients.getClientById(req.params.id, function (result) {
        res.send(result);
    });
}

//сохраняем изменения клиента
module.exports.updateClient = function updateClient(req,res){
    controllerClients.updateClient(req.params.id, req.body.hostname, function (result) {
        res.send(result);
    });
}

module.exports.getNotAcknowledgedClientsFromQuantity = function getNotAcknowledgedClientsFromQuantity(req, res) {
    controllerClients.getNotAcknowledgedClientsFromQuantity(req.params.from, req.params.quantity, function (result) {
        res.send(result);
    });
}