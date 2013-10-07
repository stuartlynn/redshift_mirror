#version 150

out vec4 outputColor;
uniform sampler2DRect video;
uniform sampler2DRect depth1;
uniform sampler2DRect depth2;
uniform sampler2DRect depth3;
uniform sampler2DRect depth4;

uniform float windowHeight;
uniform float windowWidth;
uniform float kinectWidth;
uniform float kinectHeight;

uniform int showWithRGB;

uniform float offset;
uniform float boost;

vec4 rgb2hsv(vec4 inCol)
{
    float alpha = inCol[3];
    vec3  c = vec3(inCol[0], inCol[1],inCol[2]);

    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec4(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x, alpha);
}

vec4 hsv2rgb(vec4 inCol)
{


    float alpha = inCol[3];
    vec3  c = vec3(inCol[0], inCol[1],inCol[2]);

    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    vec3 result =  c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    return vec4(result[0], result[1], result[2], alpha);
}

//in vec2 varyingtexcoord;

void main()
{
   
   
    
    
    vec2  pos = vec2(gl_FragCoord.x*kinectWidth/windowWidth, kinectHeight - gl_FragCoord.y*kinectHeight/windowHeight); 


    vec4 videoCol  = texture(video, pos);
    vec4 depthCol1 = texture(depth1,pos);
    vec4 depthCol2 = texture(depth2,pos);
    vec4 depthCol3 = texture(depth3,pos);
    vec4 depthCol4 = texture(depth4,pos);


    vec4 oldDepth  = (depthCol3 + depthCol4)/2.0;
    vec4 depth  = (depthCol1 + depthCol2)/2.0;

    float dist_change = (depth[0] - oldDepth[0])*boost;
    float finalCol = dist_change/ sqrt(1.0 + dist_change*dist_change);



    vec4 hsvVideoCol = rgb2hsv(videoCol);
    //vec4 result  = hsv2rgb(vec4(hsvVideoCol[0]+finalCol, hsvVideoCol[1] +0.5, hsvVideoCol[2], hsvVideoCol[3]));
    vec4 result  = vec4( videoCol[0] -1.0*finalCol , videoCol[1], videoCol[2] + 1.0*finalCol, 1.0);

    float alpha=1.0;
 
    float r = -1*finalCol;// + sin(offset + gl_FragCoord.x); // pow(gl_FragCoord.x / windowWidth,2);
    float g = 0; //  + sin(offset+10 + gl_FragCoord.y*gl_FragCoord.x); // pow(gl_FragCoord.y / windowHeight,2);
    float b = finalCol;// + sin(offset+120.0);
    float a = alpha;

    if(showWithRGB == 0){
        outputColor = result;//  vec4(r,g,b,a); 
    }
    else{
        outputColor= vec4(r,g,b,a);
    }
}