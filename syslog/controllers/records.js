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
//возвращаем сообщения в указаном диапазоне
module.exports.getMessages = function getMessages(callback) {
    let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message ' +
        'FROM messages';
    let date;
    
    mySqlConnection.query(sql, function (err, result) {

        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getMessages');
            console.log(err);
            return callback(null);
        }
        return callback(result);
    });
}
//Возвразщаем количество записей в таблице
module.exports.getMessagesQuantity = function getMessagesQuantity(callback) {
    let sql = 'SELECT count(*) as quantity FROM messages';
    let date;

    mySqlConnection.query(sql, function (err, result) {

        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getMessagesQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
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
        'hosts.hostname as hostnameHost, ' +
        'hosts.ip as ip ' +
        'FROM messages, hosts ' +
        'WHERE messages.idHost = hosts.id  ' +
        'ORDER BY id DESC LIMIT ' + from + ', ' + quantity;
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

//возвращаем сообщения в указаном диапазоне для клиета по Id
module.exports.getMessagesByIdClientFromQuantity = function getMessagesFromQuantity(id, from, quantity, callback) {

    let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message, ' +
        'hosts.hostname as hostname ' +
        'FROM messages, hosts ' +
        'WHERE messages.idHost = hosts.id  AND ' +
        'messages.idClient = ' + id +' ' +
        'ORDER BY id DESC LIMIT ' + from + ', ' + quantity;

    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getMessagesByIdClientFromQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result);
    });
}

//возвращаем количество сообщений для клиета по Id в таблице messages
module.exports.getMessagesByIdClientQuantity = function getMessagesQuantity(id, callback) {

    let sql = 'SELECT count (*)  as quantity ' +
        'FROM messages ' +
        'WHERE messages.idClient = ' + id; 

    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getMessagesByIdClientQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
    });
}

//возвращает сообщение по Id
module.exports.getMessageById = function getMessageById (id, callback){
    let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.idHost as idHost, ' +
        'hosts.ip as ip, ' +
        '(SELECT hosts.hostname FROM hosts WHERE messages.idHost = hosts.id) as hostnameHost, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message, ' +
        'messages.idClient as idClient, ' +
        '(SELECT clients.hostname FROM clients WHERE messages.idClient = clients.id) as hostnameClient ' +
        'FROM messages, hosts WHERE messages.id = ' + id;    
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

//добавляем запись в таблицу clients
module.exports.insertIntoClients = function insertIntoClients (mac, callback){
    let sql = 'INSERT INTO clients (mac) VALUES (' + mySqlConnection.escape(mac) + ')';
    let date;

    mySqlConnection.query(sql, function (err, result) {
        if (err){
            if (err.code != 'ER_DUP_ENTRY'){
                date = new Date();
                console.log(date + ' Syslog - Error insert a record to the table Clients.');
                console.log(err);
                return callback(null);
            }
            if (err.code == 'ER_DUP_ENTRY')
                module.exports.getClientByMac(mac, function (result) {
                    result.insertId = result.id;
                    return callback(result);
                });
        }
        else
            return callback(result);
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

//Возвразщаем количество записей в таблице
module.exports.getClientsQuantity = function getClientsQuantity(callback) {
    let sql = 'SELECT count(*) as quantity FROM clients';
    let date;

    mySqlConnection.query(sql, function (err, result) {

        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getClientsQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
    });
}

// получаем все записи из таблицы clients
module.exports.getAllClients = function getAllClients (callback){
    let sql = 'SELECT * FROM clients';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records to the table CLients. Function is getAllClients ');
            console.log(err);
            return callback(null);;
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

//обновляем запись в таблице clients
module.exports.updateClient = function updateClient (id, hostname, callback){
    let sql = 'UPDATE clients SET hostname = ' + mySqlConnection.escape(hostname) + ' ' +
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

//получаем запись из таблицы hosts по hostname
module.exports.getHostByHostName = function getHostByHostName (hostname, callback) {
    let sql = 'SELECT * FROM hosts WHERE ip= "' + hostname + '"';
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
    let sql = 'INSERT INTO hosts (ip) VALUES (' + mySqlConnection.escape(hostname) + ')';
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

//Возвразщаем количество записей в таблице
module.exports.getHostsQuantity = function getHostsQuantity(callback) {
    let sql = 'SELECT count(*) as quantity FROM hosts';
    let date;

    mySqlConnection.query(sql, function (err, result) {

        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records. Function getHostsQuantity');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
    });
}

// получаем записи из таблицы hosts с указанной позиции указанное количество
module.exports.getHostsFromQuantity = function getHostsFromQuantity (from, quantity, callback){
    let sql = 'SELECT * FROM hosts LIMIT ' + from + ', ' + quantity;
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select records to the table Hosts. Function is getHostsFromQuantity ');
            console.log(err);
            return callback(null);;
        }
        return callback(result);
    });
}

//получаем запись из таблицы hosts по id
module.exports.getHostById = function getHostById (id, callback) {
    let sql = 'SELECT * FROM hosts WHERE id= "' + id + '"';
    let date;
    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error select a record from the table Hosts. Function is getHostById.');
            console.log(err);
            return callback(null);
        }
        return callback(result[0]);
    });
}

//обновляем запись в таблице hosts
module.exports.updateHost = function updateHost (id, hostname, callback){
    let sql = 'UPDATE hosts SET hostname = ' + mySqlConnection.escape(hostname) + ' ' +
        'WHERE id = ' + id;
    let date;

    mySqlConnection.query(sql, function (err, result) {
        if (err) {
            date = new Date();
            console.log(date + ' Syslog - Error update a record to the table Hosts.');
            console.log(err);
            return callback(null);
        }
        module.exports.getHostById(id, function (result) {
            return callback(result);
        })
    });
}



/*
let sql = 'SELECT ' +
        'messages.id as id, ' +
        'messages.facility as facility, ' +
        'messages.severity as severity, ' +
        'DATE_FORMAT(messages.createdDate, \'%d.%m.%Y %T\') as createdDate, ' +
        'messages.message as message, ' +
        'hosts.hostname as hostname,' +
        'DATE_FORMAT(messages.acknowledgedDate, \'%d.%m.%Y %T\') as acknowledgedDate, ' +
        'messages.acknowledged, ' +
        '(SELECT clients.hostname FROM clients WHERE messages.idClient = clients.id) as clientHostname ' +
        'FROM messages, hosts ' +
        'WHERE messages.idHost = hosts.id  ' +
        'ORDER BY id DESC LIMIT ' + from + ', ' + quantity;
 */