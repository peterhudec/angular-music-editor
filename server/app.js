var express = require('express');

var app = express();
app.use(express.static('client'));
app.use(express.static('node_modules'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    if (host === '::') {
        host = 'localhost';
    }
    console.log('App listening att http://%s:%s', host, port);
});
