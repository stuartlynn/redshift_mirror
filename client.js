
vertexShaderStr = [
  "attribute vec2 a_position;",
  "attribute vec2 a_textureCoord;",
    
  "uniform vec2 u_offset;",
  "uniform float u_scale;",
    
  "varying vec2 v_textureCoord;",
    
  "void main() {",
    "vec2 position = a_position + u_offset;",
    "position = position * u_scale;",
    "gl_Position = vec4(position, 0.0, 1.0);",
    
    // Pass coordinate to fragment shader
    "v_textureCoord = a_textureCoord;",
  "}"
].join("\n");

fragmentShaderStr = [
  "precision mediump float;",
    
  "uniform sampler2D u_texture;",
  "uniform sampler2D u_depth1;",
  "uniform sampler2D u_depth2;",
  
  "varying vec2 v_textureCoord;",
  
  "void main() {",
      "vec4 texture_pixel = texture2D(u_texture, v_textureCoord);",
      "vec4 depth_pixel = texture2D(u_depth1, v_textureCoord/4);",
      "vec4 pixel = texture_pixel - 0.4 * depth_pixel;",
      "gl_FragColor = pixel;",
  "}"

].join("\n");

var gl;

loadShader = function(source, type) {
  shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

var websocket = require('websocket-stream');

var socketVideo = websocket('ws://localhost:2002');
var socketDepth = websocket('ws://localhost:2003');

console.log("connected");

var width = 640;
var height = 480;
var bytearray;


gl = document.getElementById("webgl").getContext('experimental-webgl');
var ctxDepth = document.getElementById('depth').getContext('2d');

gl.viewport(0, 0, width, height);
vertexShader = loadShader(vertexShaderStr, gl.VERTEX_SHADER)
fragmentShader = loadShader(fragmentShaderStr, gl.FRAGMENT_SHADER)

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

positionLocation  = gl.getAttribLocation(program, 'a_position')
texCoordLocation  = gl.getAttribLocation(program, 'a_textureCoord')
offsetLocation    = gl.getUniformLocation(program, 'u_offset')
scaleLocation     = gl.getUniformLocation(program, 'u_scale')

uTexture = gl.getUniformLocation(program, "u_texture");
uDepth1 = gl.getUniformLocation(program, "u_depth1");
uDepth2 = gl.getUniformLocation(program, "u_depth2");

gl.uniform1i(uTexture, 0);
gl.uniform1i(uDepth1, 1);
gl.uniform1i(uDepth2, 2);

gl.uniform2f(offsetLocation, -width / 2, -height / 2);
gl.uniform1f(scaleLocation, 2 / width);


texCoordBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
  gl.STATIC_DRAW
);
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

x1 = 0;
x2 = width;
y1 = 0;
y2 = height + 100;
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]), gl.STATIC_DRAW);

gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
for (var i = 0; i < 3; i++) {
  gl.activeTexture(gl.TEXTURE0 + i);
  texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

// Receive image from Kinect
var imageByteArray;

socketVideo.on('data', function (data) {
  imageByteArray = new Uint8Array(data);
});

// Receive one depth mask from Kinect


var oldData;


socketDepth.on('data', function (data) {


  gl.activeTexture(gl.TEXTURE0 + 1);


  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array(data));
  gl.drawArrays(gl.TRIANGLES, 0, 6);

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
    var od;
    if(oldData){
      od = (oldData[2*i]+oldData[2*i+1]*255)/5;
    }
    else {
      od = 0
    }

    
    // oldDepth = depth[i]

    // d = depth-oldDepth
    // console.log(d)

    var diff = depth -od 

    imgdata.data[4*i] =  (depth -od)*500
    imgdata.data[4*i+1] = 0 
    imgdata.data[4*i+2] =   - (depth -od)*500
    imgdata.data[4*i+3] = 255;
    
    // oldData[i]= depth

  }
  oldData = bytearray
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