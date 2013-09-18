$(document).ready ->

  video      = document.createElement('video');
  video.width    = 320;
  video.height   = 240;
  video.autoplay = true;

  navigator.webkitGetUserMedia "video", (stream)=>
    video.src =  webkitURL.createObjectURL(stream)

    