/*
Здесь расположены пути на основные страницы
 */

const controllerIndex = require('../controllers/index');
const controllerMessages = require('../controllers/messages.js');

module.exports = function (web) {
    web.get('/', controllerIndex.index);

    web.get('/messages/', controllerMessages.getMessages);
    web.get('/messages/notacknowledged', controllerMessages.getNotAcknowledgedMessages);

    //AJAX
    //Выдаем все сообщения в указанном диапазаоне
    web.get('/messages/:from/:quantity', controllerMessages.getMessagesFromQuantity);
    //Выдаем новые сообщения в указанном диапазаоне
    web.get('/messages/notacknowledged/:from/:quantity', controllerMessages.getNotAcknowledgedMessagesFromQuantity);
    //Сообщение прочитано
    web.post('/messages/acknowledge/:id', controllerMessages.acknowledgeMessage);
};
