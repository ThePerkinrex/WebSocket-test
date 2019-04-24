class WSClient {
    constructor(url='ws://'+document.location.host){
        this.ws = new WebSocket(url)
        this.commandListeners = {}
        this.ws.onmessage = (data) => {
            let cmd = JSON.stringify(data)
            if(this.commandListeners[cmd.command]) this.commandListeners[cmd.command](cmd.data)
        }
    }

    /**
     * Call this to attach a callback to a command
     * 
     * Only one callback per command is allowed
     * 
     * @param {String} cmd The command listenting for
     * @param {function(Object)} cb The callback to execute for that command
     */
    on(cmd, cb) { // TODO: Add multiple callbacks for each command
        this.commandListeners[cmd] = cb
    }

    /**
     * Call this to deattach a callback from a command
     * @param {String} cmd 
     */
    off(cmd) {
        this.commandListeners[cmd] = undefined
    }
}
