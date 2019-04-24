const WebSocket = require('ws');

class WSServer {
    /**
     * @param {Server} server The http server (for express, use require('http').createServer(app))
     */
    constructor(server) {
        this.onmessage = (data)=>{}
        this.onconnect = (ws)=>{}
        this.onclose = (ws)=>{}

        this.wss = new WebSocket.Server({server})
        this.connections = []
        this.wss.on('connection', (ws)=>{
            let i = this.connections.push(ws)
            this.onconnect(ws)
            ws.on('message', (data)=>{this.onmessage(data)})
            ws.on('close', ()=>{
                this.connections.splice(i,1)
                this.onclose(ws)
            })
        })
    }

    on(event, fn){
        switch(event) {
            case 'connect':
                this.onconnect = fn
                break
            case 'message':
                this.onmessage = fn
                break
            case 'close':
                this.onclose = fn
                break
        }
    }

    broadcast(data){
        for (ws of this.connections) {
            ws.send(JSON.stringify(data))
        }
    }

    send(data, idx){
        this.connections[idx].send(JSON.stringify(data))
    }

    broadcastCmd(command, data) {
        for (ws of this.connections) {
            ws.send(JSON.stringify({command,data}))
        }
    }

    sendCmd(command, data, idx){
        this.connections[idx].send(JSON.stringify({command,data}))
    }
}