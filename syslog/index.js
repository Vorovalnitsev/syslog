const syslog = require('./syslog');
const config = require('../config');
const recordsController = require('./controllers/records.js');
const async = require('async');

let syslogSocketParameter;

//проверяем переменные окружения
switch (process.env.NODE_ENV){
    case 'production':
        syslogSocketParameter = config.getSyslogSocketParameterProduction;
        break;
    default:
        syslogSocketParameter = config.getSyslogSocketParameterTest;
        break;
}

syslog(syslogSocketParameter, function (record) {
    let date = new Date();

    /*Проверяем наличие в записи MAC адреса
    пример регулярного выражения
    alert("01:AF:BC:45".match(/[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]/));

    Проверяем наличие MAC в таблице clients. Если такого MAC нет, то добавляем его.
    */


    /*
   Проверяем наличие hostname в таблице Hosts. Если такого hostname нет, то добавляем его, получаем его id
   и вставляем новую запись в messages, установив idHosts.
   Если есть hostname в таблице hosts, то получаем id и вставляем новую запись в messages, установив idHosts.
   */

    let idHost = null;
    let idClient = null;
    let mac = record.message.match(/[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]:[A-F0-9][A-F0-9]/);

    async.waterfall([
        function (callback) {
            recordsController.getHostByHostName(record.hostname, function (result) {
                if (!result) {
                    recordsController.insertIntoHosts(record.hostname, function (result) {
                        if (result)
                            return callback(null,result.insertId);
                        else return callback(null);
                    });

                }
                else
                    return callback(null,result.id);
            });
        },
        function (idHost, callback) {
        if (mac){
            recordsController.getClientByMac(mac, function (result) {
                if (!result) {
                    recordsController.insertIntoClients(mac, function (result) {
                        if (result)
                            return callback(null, idHost, result.insertId);
                        else return callback(null);
                    });
                }
                else
                    return callback(null, idHost, result.id);
            });
        }
        else
            return callback(null, idHost, null);
        },
        function (idHost, idClient) {
            recordsController.insertIntoMessages(
                idHost,
                record.facility,
                record.severity,
                date,
                record.message,
                idClient,
                function (result) {
                    return;
                });
        }
    ]);
});

