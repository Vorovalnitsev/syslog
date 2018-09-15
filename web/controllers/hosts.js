const controllerHosts = require('../../syslog/controllers/records.js');


module.exports.getHosts = function getHosts(req, res) {
    res.render('hosts.handlebars');
}

//возвращаем hosts с позиции - количество
module.exports.getHostsFromQuantity = function getHostsFromQuantity(req,res){
    controllerHosts.getHostsFromQuantity(req.params.from, req.params.quantity, function (result) {
        res.send(result);
    });
}

//возвращаем host по id
module.exports.getHostById = function getHostById(req,res){
    controllerHosts.getHostById(req.params.id, function (result) {
        res.send(result);
    });
}

//сохраняем изменения host
module.exports.updateHost = function updateHost(req,res){
    controllerHosts.updateHost(req.params.id, req.body.comment, function (result) {
        res.send(result);
    });
}