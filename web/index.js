const express = require('express');
const expressHandlebars = require('express-handlebars');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const routesIndex = require('./routes/index.js');

//настройка express
const PORT_APP = '8080';
const web = express();


web.use(favicon(__dirname + '/public/img/favicon.ico'));
web.use(bodyParser.urlencoded({extended: false}));
web.set('views', __dirname + '/views');


web.engine('handlebars', expressHandlebars({
    defaultLayout : 'main',
    layoutsDir: __dirname + '/views/layouts'
}));
web.set('view engine', 'handlebars');
//статические пути
web.use(express.static(__dirname  +  '/public'));

//пути

routesIndex(web);

web.listen(PORT_APP, function () {
    let date = new Date();
    console.log(date +' Web server is started on http://localhost:' + PORT_APP + ' Press Ctrl + C for stop.');
});