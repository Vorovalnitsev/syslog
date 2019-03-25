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
    //web.get('/messages/client/:id/', controllerMessages.getMessages);
    //AJAX
    //Выдаем все сообщения УДАЛИТЬ В БУДУЩЕМ
    web.get('/messages/', controllerMessages.getMessages);
     //Выдаем количество записей в таблице
     web.get('/messages/quantity', controllerMessages.getMessagesQuantity);
    //Выдаем сообщение по id
    web.get('/messages/:id', controllerMessages.getMessageById);
    //Выдаем все сообщения в указанном диапазаоне для указанного клиента
    web.get('/messages/client/:id/:from/:quantity', controllerMessages.getMessagesByIdClientFromQuantity);
    //Выдаем количество записей для указанного клиента
    web.get('/messages/client/:id/quantity', controllerMessages.getMessagesByIdClientQuantity);
    //Выдаем все сообщения в указанном диапазаоне
    web.get('/messages/:from/:quantity', controllerMessages.getMessagesFromQuantity);

    //Клиенты
    //Static
    //web.get('/clients/', controllerClients.getClients);

    //Ajax
    //Выводим всех клиентов
    web.get ('/clients/', controllerClients.getAllClients);
    //Выдаем количество записей в таблице
    web.get('/clients/quantity', controllerClients.getClientsQuantity);
    //Выдаем клиентов в указанном диапазаоне
    web.get ('/clients/:from/:quantity', controllerClients.getClientsFromQuantity);
    //Возвращаем клиента по id
    web.get ('/clients/:id', controllerClients.getClientById);
    //сохраняем изменения для клиента
    web.put ('/clients/:id', controllerClients. updateClient);

    //Hosts
    //Static
    web.get('/hosts/', controllerHosts.getHosts);

    //Ajax
    //Выдаем количество записей в таблице
    web.get ('/hosts/quantity', controllerHosts.getHostsQuantity);
    //Выводим всех клиентов
    web.get ('/hosts/:from/:quantity', controllerHosts.getHostsFromQuantity);
    //Возвращаем host по id
    web.get ('/hosts/:id', controllerHosts.getHostById);
    //сохраняем изменения для host
    web.put ('/hosts/:id', controllerHosts.updateHost);
};
