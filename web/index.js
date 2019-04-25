let ws = new WSClient()
ws.onconnect(()=>{
    ws.sendCmd('test', 'hello')
})
ws.on('test', (data)=>{
    console.log(data)
})