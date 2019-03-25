const express = require('express');
const expressHandlebars = require('express-handlebars');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const routesIndex = require('./routes/index.js');
const config = require('../config');

//настройка express
let webServerParameter;
//проверяем переменные окружения
switch (process.env.NODE_ENV){
    case 'production':
        webServerParameter = config.getWebServerParameterProduction();
        break;
    default:
        webServerParameter = config.getWebServerParameterTest();
        break;
}

const web = express();

web.use(favicon(__dirname + '/public/img/favicon.ico'));
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({extended: false}));
web.set('views', __dirname + '/views');


web.engine('handlebars', expressHandlebars({
    defaultLayout : 'main',
    layoutsDir: __dirname + '/views/layouts'
}));
web.set('view engine', 'handlebars');
//статические пути
web.use(express.static(__dirname  +  '/public'));

web.use(function (req, res, next){
    if (process.env.NODE_ENV!='production'){
        let date = new Date();
        console.log(date + ' ' + req.method + ' ' + req.url);

    }        
    next();
});


//пути

web.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    next();
});

routesIndex(web);

web.listen(webServerParameter, function () {
    let date = new Date();
    console.log(date + ' Web server is started on ' +
        'http://' + webServerParameter.hostname +':' + webServerParameter.port +
        ' Press Ctrl + C for stop.');
});