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

//Настройки создания UDP сокеда для получения сообщений от устройств

function getSyslogSocketParameterTest() {
    return {
        address: 'localhost',
        port: '1514',
        exclusive: 'false'
    }
}

function getSyslogSocketParameterProduction() {
    return {
        address: '207.154.224.201',
        port: '514',
        exclusive: 'false'
    }
}

module.exports.getSyslogSocketParameterTest = getSyslogSocketParameterTest();
module.exports.getSyslogSocketParameterProduction = getSyslogSocketParameterProduction();
