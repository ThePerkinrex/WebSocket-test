let WebSocket
try {
    WebSocket = require('ws');
} catch {
    console.exception('This WebSocket implementation requires the `ws` library'+require('os').EOL+
                        'To install it, type `npm i ws`')
}



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
        this.commandListeners = {}
        this.wss.on('connection', (ws)=>{
            let i = this.connections.push(ws)
            this.onconnect(ws)
            ws.on('message', (data)=>{
                this.onmessage(i, data)
                let cmd = JSON.parse(data)
                if(this.commandListeners[cmd.command]) this.commandListeners[cmd.command](i, cmd.data)
            })
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
            default:
                this.commandListeners[event] = fn
        }
    }

    onEvt(event, fn){
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

    onCmd(event, fn){
        this.commandListeners[event] = fn
    }

    /**
     * Call this to deattach a callback from a command
     * @param {String} cmd 
     */
    off(cmd) {
        this.commandListeners[cmd] = undefined
    }

    broadcast(data){
        for (let ws of this.connections) {
            ws.send(JSON.stringify({command: 'data',data}))
        }
    }

    send(data, idx){
        this.connections[idx].send(JSON.stringify({command: 'data',data}))
    }

    broadcastCmd(command, data) {
        for (let ws of this.connections) {
            ws.send(JSON.stringify({command,data}))
        }
    }

    sendCmd(command, data, idx){
        this.connections[idx].send(JSON.stringify({command,data}))
    }
}

module.exports = WSServer