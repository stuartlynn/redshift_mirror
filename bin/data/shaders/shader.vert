#version 150
 
uniform mat4 modelViewProjectionMatrix;
in vec4 position;
//out vec2 varyingtexcoord;

void main(){
  //  varyingtexcoord = vec2(texcoord.x, texcoord.y);
    gl_Position = modelViewProjectionMatrix * position;
}