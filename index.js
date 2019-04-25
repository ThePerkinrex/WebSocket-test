const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});
app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/web/index.js');
});
app.get('/clientWSCommand.js', function (req, res) {
    res.sendFile(__dirname + '/web/clientWSCommand.js');
});

let server = require('http').createServer(app) 

let wss = new (require('./serverWSCommand.js'))(server)
wss.on('test', (i, data)=>{
    console.log(i+': '+data)
    wss.broadcastCmd('test', {test: 'object'})
})

server.listen(8080)

// Really easy