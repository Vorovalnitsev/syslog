const syslog = require('./syslog/');
const  web = require('./web/');
let date = new Date();
switch (process.env.NODE_ENV){
    case 'production':
        console.log(date + ' Starting service. Mode is production.');
        break;
    default:
        console.log(date + ' Starting service. Mode is test.');
        break;
}



/*app.use (function(req, res, next) {
    if (!process.env.NODE_ENV || !process.env.NODE_ENV.localeCompare('test')){
        console.log(req.path);
    }
    next();
});
*/