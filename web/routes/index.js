/*
Здесь расположены пути на основные страницы
 */

const controllerIndex = require('../controllers/index');
const controllerMessages = require('../controllers/messages.js');
const controllerClients = require('../controllers/clients.js');


module.exports = function (web) {
    web.get('/', controllerIndex.index);




    //Собщения
    //Static
    web.get('/messages/', controllerMessages.getMessages);
    web.get('/messages/notacknowledged', controllerMessages.getNotAcknowledgedMessages);
    //AJAX
    //Выдаем все сообщения в указанном диапазаоне
    web.get('/messages/:from/:quantity', controllerMessages.getMessagesFromQuantity);
    //Выдаем новые сообщения в указанном диапазаоне
    web.get('/messages/notacknowledged/:from/:quantity', controllerMessages.getNotAcknowledgedMessagesFromQuantity);
    //Сообщение прочитано
    web.post('/messages/acknowledge/:id', controllerMessages.acknowledgeMessage);
    //Возвращаем количество непрочитанных сообщений
    web.get('/messages/getnotacknowledgedcount', controllerMessages.getNotAcknowledgedMessagesCount);


    //Клиенты
    //Static
    web.get('/clients/', controllerClients.getClients);
    web.get('/clients/notacknowledged', controllerClients.getNotAcknowledgedClients);


    //Ajax
    //Выводим всех клиентов
    web.get ('/clients/:from/:quantity', controllerClients.getClientsFromQuantity);
    //Возвращаем количество новых клиентов
    web.get('/clients/getnotacknowledgedcount', controllerClients.getNotAcknowledgedClientsCount);
    //Возвращаем клиента по id
    web.get ('/clients/:id', controllerClients.getClientById);
    //Выдаем новые сообщения в указанном диапазаоне
    web.get('/clients/notacknowledged/:from/:quantity', controllerClients.getNotAcknowledgedClientsFromQuantity);


    //сохраняем изменения для клиента
    web.post ('/clients/:id/update', controllerClients. updateClient);
};
