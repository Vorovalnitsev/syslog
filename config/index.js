// Файл конфигурации

//Строки подключения к MySql

function getMySqlConnectionStringTest(){
    return {
        host: 'localhost',
        user: 'syslog',
        password: 'syslog12082018',
        database: 'syslog'
    }
}

function getMySqlConnectionStringProduction(){
    return {
        host: 'localhost',
        user: 'syslog',
        password: 'syslog12082018',
        database: 'syslog'
    }
}
module.exports.getMySqlConnectionStringTest = getMySqlConnectionStringTest();
module.exports.getMySqlConnectionStringProduction = getMySqlConnectionStringProduction();

//Настройки создания UDP сокета для получения сообщений от устройств


function getSyslogSocketParameterTest() {
    return {
        address: '0.0.0.0',
        port: '1514',
        exclusive: 'false'
    }
}

function getSyslogSocketParameterProduction() {
    return {
        address: 'localhost',
        port: '1514',
        exclusive: 'false'
    }
}

module.exports.getSyslogSocketParameterTest = getSyslogSocketParameterTest();
module.exports.getSyslogSocketParameterProduction = getSyslogSocketParameterProduction();


//Настройки для web-сервера

module.exports.getWebServerParameterProduction = function getWebServerParameterProduction() {
    return {
        hostname: 'localhost',
        port: '8080'
    }
}


module.exports.getWebServerParameterTest = function getWebServerParameterTest() {
    return {
        hostname: 'localhost',
        port: '8080'
    }
}