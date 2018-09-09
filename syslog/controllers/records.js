const config = require('../../config');
const mysql = require('mysql');

let mySqlConnection;
let mySqlConnectionString;

//проверяем переменные окружения
switch (process.env.NODE_ENV){
    case 'production':
        mySqlConnectionString = config.getMySqlConnectionStringProduction;
        break;
    default:
        mySqlConnectionString = config.getMySqlConnectionStringProduction;
        break;
}
// Подключение к MySQL
mySqlConnection = mysql.createConnection(mySqlConnectionString);

mySqlConnection.connect(function(err) {
    let date = new Date();
    console.log(date + ' Syslog - Syslog tries connect to MySQL.');

    if (err) {
        date = new Date();
        console.log(date + ' Syslog - Error connect to MySQL.');
        console.log(err);
        return callback(null);;
    }
    date = new Date();
    console.log(date + ' Syslog - MySQL is connected.');
});


//вставляем запись в табилцу messages
module.exports.insertIntoMessages = function insertIntoMessages (idHost, facility, severity, createdDate, message,
                                                                 idClient, callback){
    let sql = 'INSERT INTO messages ( idHost, facility, severity, createdDate, message, idClient ) ' +
        'VALUES (' +
        mySqlConnection.escape(idHost)+ ',' +
        mySqlConnection.escape(facility) + ',' +
        mySqlConnection.escape(severity) + ',' +
        mySqlConnection.escape(createdDate) + ',' +
        mySqlConnection.escape(message) + ',' +
        mySqlConnection.escape(idClient)  + ')';

    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            let date = new Date();
            console.log(date + ' Syslog - Error insert a record to the table Messages.');
            console.log(err);
            return callback(null);
        }
        return callback(result);
    })
}

/*
выбираем записи из таблицы messages
указываем диапазон записей для выборки
*/
//возвращаем количество не просмотренных сообщений
module.exports.getNotAcknowledgedMessagesCount = function getNotAcknowledgedMessagesCount(callback) {
    let sql = 'SELECT COUNT(*) as count FROM syslog.messages WHERE acknowledged = FALSE';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getCountNotAcknowledgedMessages');
            console.log(err);
            return callback(0);
        }
        return callback(result[0].count);
    });
}

//возвращаем не просмотренные сообщения
module.exports.getNotAcknowledgedMessagesFromQuantity = function getNotAcknowledgedMessagesFromQuantity(from, quantity, callback) {

    let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message, ' +
        'hosts.hostname as hostname,' +
        'DATE_FORMAT(messages.acknowledgedDate, \'%d.%m.%Y %T\') as acknowledgedDate, ' +
        'messages.acknowledged ' +
        'FROM messages, hosts WHERE messages.idHost = hosts.id AND acknowledged = false ' +
        'ORDER BY createdDate DESC LIMIT ' + from + ', ' + quantity;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getNotAcknowledgedMessagesFromQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result);
    });
}

//возвращаем сообщения в указаном диапазоне
module.exports.getMessagesFromQuantity = function getMessagesFromQuantity(from, quantity, callback) {

    let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message, ' +
        'hosts.hostname as hostname,' +
        'DATE_FORMAT(messages.acknowledgedDate, \'%d.%m.%Y %T\') as acknowledgedDate, ' +
        'messages.acknowledged ' +
        'FROM messages, hosts WHERE messages.idHost = hosts.id ORDER BY id DESC LIMIT ' + from + ', ' + quantity;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getMessagesFromQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result);
    });
}
//возвращает сообщение по Id
module.exports.getMessageById = function getMessageById (id, callback){
    let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message, ' +
        'hosts.hostname as hostname,' +
        'DATE_FORMAT(messages.acknowledgedDate, \'%d.%m.%Y %T\') as acknowledgedDate, ' +
        'messages.acknowledged ' +
        'FROM messages, hosts WHERE messages.idHost = hosts.id AND messages.id = ' + id;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select record. Function getAcknowledgeMessage');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
    });
}

//устанавливает, что сообщение прочитано
module.exports.setAcknowledgeMessage = function setAcknowledgeMessage(id, callback) {
    let date = new Date();
    let sql = 'UPDATE messages SET acknowledged = true, acknowledgedDate = ' + mySqlConnection.escape(date) +
        ' WHERE id = ' + id + ' AND acknowledged = false';
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error update records. Function setAcknowledgeMessage');
            console.log(err);
            return callback(null);
        }
        module.exports.getMessageById(id, function (result) {
            return callback(result);
        })
    });
}

//добавляем запись в таблицу clients
module.exports.insertIntoClients = function insertIntoClients (mac, callback){
    let sql = 'INSERT INTO clients (mac) VALUES (' + mySqlConnection.escape(mac) + ')';
    let date;

    mySqlConnection.query(sql, function (err, result) {
        if (err){
            console.log('1' + result);
            if (err.code != 'ER_DUP_ENTRY'){
                date = new Date();
                console.log(date + ' Syslog - Error insert a record to the table Clients.');
                console.log(err);
                return callback(null);
            }
            if (err.code == 'ER_DUP_ENTRY')
                module.exports.getClientByMac(mac, function (result) {
                    result.insertId = result.id;
                    console.log('2' + result);
                    return callback(result);
                });
        }
        else
            return callback(result);
    });
}

//обновляем запись в таблице clients
module.exports.updateClient = function updateClient (id, hostname, callback){
    let sql = 'UPDATE clients SET hostname = ' + mySqlConnection.escape(hostname) + ', ' +
        'acknowledged = true ' +
        'WHERE id = ' + id;
    let date;

    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error update a record to the table Clients.');
            console.log(err);
            return callback(null);
        }
        module.exports.getClientById(id, function (result) {
            return callback(result);
        })
    });
}

//возвращаем количество новых клиентов
module.exports.getNotAcknowledgedClientsCount = function getNotAcknowledgedClientsCount(callback) {
    let sql = 'SELECT COUNT(*) as count FROM syslog.clients WHERE acknowledged = false;';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getCountNotAcknowledgedClients');
            console.log(err);
            return callback(0);
        }
        return callback(result[0].count);
    });
}

//получаем запись из таблицы clients по MAC
module.exports.getClientByMac = function getClientByMac (mac, callback) {
    let sql = 'SELECT * FROM clients WHERE mac= "' + mac + '"';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select a record from the table Clients. Function is getClientByMac');
            console.log(err);
            return callback(null);;
        }
        return callback(result[0]);
    });
}

// получаем записи из таблицы clients с указанной позиции указанное количество
module.exports.getClientsFromQuantity = function getClientsFromQuantity (from, quantity, callback){
    let sql = 'SELECT * FROM clients LIMIT ' + from + ', ' + quantity;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records to the table CLients. Function is getClientsFromQuantity ');
            console.log(err);
            return callback(null);;
        }
        return callback(result);
    });
}

//возвращаем не просмотренные mac адреса
module.exports.getNotAcknowledgedClientsFromQuantity = function getNotAcknowledgedClientsFromQuantity(from, quantity, callback) {

    let sql = 'SELECT * FROM clients WHERE acknowledged = false LIMIT ' + from + ', ' + quantity;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getNotAcknowledgedClientsFromQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result);
    });
}

// получаем запись из таблицы clients по id
module.exports.getClientById = function getClientById (id, callback){
    let sql = 'SELECT * FROM clients WHERE id =  ' + id;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select a record from the table CLients. Function is getClientById ');
            console.log(err);
            return callback(null);;
        }
        return callback(result[0]);
    });
}

//получаем запись из таблицы hosts по hostname
module.exports.getHostByHostName = function getHostByHostName (hostname, callback) {
    let sql = 'SELECT * FROM hosts WHERE hostname= "' + hostname + '"';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select a record from the table Hosts. Function is getHostByHostName.');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
    });
}

//добавляем запись в таблицу Hosts
module.exports.insertIntoHosts = function insertIntoHosts (hostname, callback){
    let sql = 'INSERT INTO hosts (hostname) VALUES (' + mySqlConnection.escape(hostname) + ')';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err){
            console.log('1' + result);
            if (err.code != 'ER_DUP_ENTRY'){
                date = new Date();
                console.log(date + ' Syslog - Error insert a record to the table Hosts.');
                console.log(err);
                return callback(null);
            }
            if (err.code == 'ER_DUP_ENTRY')
                module.exports.getHostByHostName(hostname, function (result) {
                    result.insertId = result.id;
                    console.log('2' + result);
                    return callback(result);
                });
        }
            else
                return callback(result);
    });
}

