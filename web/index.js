let ws = new WebSocket('ws://'+document.location.host)
ws.onmessage = message=>console.log(message.data)
ws.onopen = ()=>{
    ws.send('Hello server from JS')
}