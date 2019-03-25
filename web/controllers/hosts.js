const controllerHosts = require('../../syslog/controllers/records.js');


module.exports.getHosts = function getHosts(req, res) {
    res.render('hosts.handlebars');
}

//возвращаем hosts с позиции - количество
module.exports.getHostsFromQuantity = function getHostsFromQuantity(req,res){
    controllerHosts.getHostsFromQuantity(req.params.from, req.params.quantity, function (result) {        
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

//Возвращаем количествр записей в таблице
module.exports.getHostsQuantity = function getHostsQuantity(req, res) {
    controllerHosts.getHostsQuantity(function (result) {        
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

//возвращаем host по id
module.exports.getHostById = function getHostById(req,res){
    controllerHosts.getHostById(req.params.id, function (result) {
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

//сохраняем изменения host
module.exports.updateHost = function updateHost(req,res){
    controllerHosts.updateHost(req.params.id, req.body.hostname, function (result) {
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