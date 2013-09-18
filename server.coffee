
express = require('express')
kinect  = require("kinect")

WebSocketServer = require('ws').Server
websocket = require('websocket-stream')
BufferStream = require('bufferstream')

app = new express()
wss = new WebSocketServer({port: 2002});
wss2 = new WebSocketServer({port: 2003});

app.use(express.static(__dirname + '/public'))

kstreamVideo = new BufferStream()
kstreamDepth = new BufferStream()


setupSockets= ()->
  console.log "setting up sockets"
  wss.on "connection", (ws)->
    console.log "connected"
    stream = websocket(ws)
    kstreamVideo.pipe stream
    ws.on "close", ->
      stream.writeable = false 
      console.log "closing socket"
  
  wss2.on "connection", (ws)->
    console.log "connected2"
    stream = websocket(ws)
    kstreamDepth.pipe stream
    ws.on "close", ->
      stream.writeable = false
      console.log = false



setupKinect = ()->
  context = kinect()
  setTimeout ->
    context.resume()

    setTimeout ->
      context.on "video", (buf)-> 
        # console.log("data")
        kstreamVideo.write(buf)
      context.on "depth", (buf)->
        kstreamDepth.write(buf)
    , 100
    
    setTimeout ->
      context.start("video")
      context.start("depth")
      setupSockets()
    ,200
  ,300


setupKinect()
app.listen(2001)
