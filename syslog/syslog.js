/*
Модуль реализует функции syslog server
Разработан на основе RCF3164
https://tools.ietf.org/html/rfc3164
 */

//Подключение сторонних библиотек
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

//Константы

//Параметры создания сокета
let bindParameters = {
    address: 'localhost',
    port: '1514',
    exclusive: 'false'
};

//Facilities from RCF3164
const FACILITY = [
    'kernel messages',
    'user-level messages',
    'mail system',
    'system daemons',
    'security/authorization messages (note 1)',
    'messages generated internally by syslogd',
    'line printer subsystem',
    'network news subsystem',
    'UUCP subsystem',
    'clock daemon (note 2)',
    'security/authorization messages (note 1)',
    'FTP daemon',
    'NTP subsystem',
    'log audit (note 1)',
    'log alert (note 1)',
    'clock daemon (note 2)',
    'local use 0  (local0)',
    'local use 1  (local1)',
    'local use 2  (local2)',
    'local use 3  (local3)',
    'local use 4  (local4)',
    'local use 5  (local5)',
    'local use 6  (local6)',
    'local use 7  (local7)'
];

//Severities from RCF3164
const SEVERITY = [
    'Emergency',
    'Alert',
    'Critical',
    'Error',
    'Warning',
    'Notice',
    'Informational',
    'Debug'
];

//Возвращает по номеру Facility
function getFacility(num) {
    return FACILITY[num];
}

//Возвращает по номеру Severity
function getSeverity(num) {
    return SEVERITY[num];
}

function listen(options, fn){

    if (options){
        bindParameters.address = options.address;
        bindParameters.port = options.port;
        bindParameters.exclusive = options.exclusive;
    }
    //Устанавливаем обработчики событий
    server.on('error',function (err) {
        let date = new Date();
        console.log(date + ' Syslog - Server error. ');
        console.log(err);
        server.close();
    });

    server.on('message', function (message, rinfo) {
        let messageString = message.toString();

        //console.log('Message from ' + rinfo.address + ':' + rinfo.port);
        //console.log (messageString);

        /*
        // Работаем с PRI
        //<PRI>MM dd hh:mm:ss hostname tag: info
        //<PRI>MM dd hh:mm:ss hostname info

        var dateIndex = msgString.indexOf('>');
        var pri = Number(msgString.substring(1, dateIndex));
        var date = msgString.substring(dateIndex+1, 19);
        var facility = 0;
        var severity = 0;

        var msg = '';
        var hostName = '';

        var tagIndex = 0;
        var tag = '';

        var msgIndex = msgString.indexOf(': ');
        if (msgIndex!= -1){
            msg = msgString.substring(msgIndex+2, msgString.length);
            tagIndex = msgString.substring(dateIndex+1,msgIndex).lastIndexOf(' ');
            tag = msgString.substring(tagIndex+2+dateIndex, msgIndex);

            if (tagIndex < 20)
                var hostName = '';
            else{
                hostName = msgString.substring(20, tagIndex-1);
            }


        }
        else
        {
            msg = hostName = msgString.substring(20, msgString.length);
            hostName = '';
            tag ='';

        }

        if (pri != 0 ){
            facility = Math.floor(pri/8);
            severity = pri % 8;
        }

        console.log('PRI = ' + pri + ' facility = ' + facility + ' severity= ' + severity);
        console.log ('Facility = ' + FACILITY[facility] + '         severity = ' + SEVERITY[severity]);
        console.log('Date = ' + date);
        console.log('Hostname =' + hostName)
        console.log('Tag = ' + tag);
        console.log('Msg = ' + msg);
        */

        /*
        15.10.17 так как все устройства по разному присылают сообщения, принято решение
        из сообщения извлекать только PRI остальное использовать как msg.

        в пакет JSON складываем следующие данные
        Date and Time время получения дейтаграммы в милисекундах с 1 января 1970 года 00:00:00 по UTC
        Facility из PRI
        Severity из PRI
        host из информации о дейтаграмме
        msg из принятой дейтаграммы за исключением PRI
         */
        let msgIndex = messageString.indexOf('>');
        let msg = messageString.substring(msgIndex+1, messageString.length);

        let pri = Number(messageString.substring(1, msgIndex));
        let facility = 0;
        let severity = 0;
        let date = new Date;
        let hostname = rinfo.address;

        if (pri != 0 ){
            facility = Math.floor(pri/8);
            severity = pri % 8;
        }

        let record = {
            facility : facility,
            severity : severity,
            date : date,
            hostname : hostname,
            message : msg
        };

        fn(record);
    });

    server.on('listening', function () {

        const address = server.address();
        let date  = new Date();
        console.log(date + ' Syslog - The Syslog server is started on ' + address.address + ':' + address.port);
    });

    server.bind(bindParameters);
}

module.exports = listen;
module.exports.getFacility = getFacility;
module.exports.getSeverity = getSeverity;


