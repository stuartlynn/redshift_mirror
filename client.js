var websocket = require('websocket-stream');

var socketVideo = websocket('ws://localhost:2002');
var socketDepth = websocket('ws://localhost:2003');

console.log("connected");

var width = 640;
var height = 480;
var bytearray;

var ctxVideo = document.getElementById('video').getContext('2d');
var ctxDepth = document.getElementById('depth').getContext('2d');

//video vis

socketVideo.on('data', function (data) {
  var bytearray = new Uint8Array(data);
  var imgdata = ctxVideo.getImageData(0,0, width, height);
  var imgdatalen = imgdata.data.length;

  oldData = []

  for(var i = 0 ; i< 307200 ; i++){
    oldData[i] = 0
  }

  console.log("got data")
  for(var i=0;i<imgdatalen/4;i++){

    
     //for video feed . bytearray [r,g,b,r,g,b...]
    imgdata.data[4*i] = bytearray[3*i];
    imgdata.data[4*i+1] = bytearray[3*i+1];
    imgdata.data[4*i+2] = bytearray[3*i+2];
    imgdata.data[4*i+3] = 255;
    

    //for depth feed  . bytearray  [val , mult, val2, mult2, ...]
    // var depth = (bytearray[2*i]+bytearray[2*i+1]*255)/5;
    // imgdata.data[4*i] = depth;
    // imgdata.data[4*i+1] = depth;
    // imgdata.data[4*i+2] = depth;
    // imgdata.data[4*i+3] = 255;
  }
  ctxVideo.putImageData(imgdata,0,0)

});



socketDepth.on('data', function (data) {
  var bytearray = new Uint8Array(data);
  var imgdata = ctxDepth.getImageData(0,0, width, height);
  var imgdatalen = imgdata.data.length;

  for(var i=0;i<imgdatalen/4;i++){


    
     //for video feed . bytearray [r,g,b,r,g,b...]
    // imgdata.data[4*i] = bytearray[3*i];
    // imgdata.data[4*i+1] = bytearray[3*i+1];
    // imgdata.data[4*i+2] = bytearray[3*i+2];
    // imgdata.data[4*i+3] = 255;
    

    // for depth feed  . bytearray  [val , mult, val2, mult2, ...]
    var depth = (bytearray[2*i]+bytearray[2*i+1]*255)/5 ;
    
    // oldDepth = depth[i]

    // d = depth-oldDepth
    // console.log(d)

    imgdata.data[4*i] = depth
    imgdata.data[4*i+1] = depth
    imgdata.data[4*i+2] = depth
    imgdata.data[4*i+3] = 255;
    
    // oldData[i]= depth

  }
  ctxDepth.putImageData(imgdata,0,0)

});


socketVideo.on('end', function(){
  console.log("stream ended");
  socket.close();
});

socketDepth.on('end', function(){
  console.log("stream ended");
  socket.close();
});