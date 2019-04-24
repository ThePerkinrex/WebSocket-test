const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/web/index.html');
});
app.get('/index.js', function (req, res) {
    res.sendFile(__dirname + '/web/index.js');
});
/*
app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
*/
const WebSocket = require('ws');
let server = require('http').createServer(app) 

const wss = new WebSocket.Server({server});

wss.on('connection',(ws)=>{
    console.log(`someone has connected`)
    ws.send('Hello')
    ws.on('message', (message)=>{
        console.log(message)
        ws.send('Hello back')
    })
    ws.on('close', ()=>{
        console.log(`someone has disconnected`)
    })
})

server.listen(8080)

// Really easy