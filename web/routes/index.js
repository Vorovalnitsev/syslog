/*
Здесь расположены пути на основные страницы
 */

const controllerIndex = require('../controllers/index');
const controllerMessages = require('../controllers/messages.js');
const controllerClients = require('../controllers/clients.js');
const controllerHosts = require('../controllers/hosts.js');



module.exports = function (web) {
    web.get('/', controllerIndex.index);




    //Собщения
    //Static
    web.get('/messages/', controllerMessages.getMessages);
    web.get('/messages/client/:id/', controllerMessages.getMessages);
    //AJAX

    //Выдаем все сообщения в указанном диапазаоне для указанного клиента
    web.get('/messages/client/:id/:from/:quantity', controllerMessages.getMessagesByIdClientFromQuantity);
    //Выдаем все сообщения в указанном диапазаоне
    web.get('/messages/:from/:quantity', controllerMessages.getMessagesFromQuantity);

    //Клиенты
    //Static
    web.get('/clients/', controllerClients.getClients);

    //Ajax
    //Выводим всех клиентов
    web.get ('/clients/all', controllerClients.getAllClients);
    //Выдаем клиентов в указанном диапазаоне
    web.get ('/clients/:from/:quantity', controllerClients.getClientsFromQuantity);
    //Возвращаем клиента по id
    web.get ('/clients/:id', controllerClients.getClientById);
    //сохраняем изменения для клиента
    web.post ('/clients/:id/update', controllerClients. updateClient);

    //Hosts
    //Static
    web.get('/hosts/', controllerHosts.getHosts);

    //Ajax
    //Выводим всех клиентов
    web.get ('/hosts/:from/:quantity', controllerHosts.getHostsFromQuantity);
    //Возвращаем host по id
    web.get ('/hosts/:id', controllerHosts.getHostById);
    //сохраняем изменения для host
    web.post ('/hosts/:id/update', controllerHosts.updateHost);

};
