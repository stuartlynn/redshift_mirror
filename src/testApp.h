#pragma once

#include "ofMain.h"
#include "ofxKinect.h"

class testApp : public ofBaseApp{
    
public:
    void setup();
    void update();
    void draw();
    
    void keyPressed(int key);
    void keyReleased(int key);
    void mouseMoved(int x, int y );
    void mouseDragged(int x, int y, int button);
    void mousePressed(int x, int y, int button);
    void mouseReleased(int x, int y, int button);
    void windowResized(int w, int h);
    void dragEvent(ofDragInfo dragInfo);
    void gotMessage(ofMessage msg);
    
    ofxKinect kinect;
    ofTexture depth1;
    ofTexture depth2;
    ofTexture depth3;
    ofTexture depth4;
    
    ofShader shader;
    
    ofPixels rgbDepth1;
    ofPixels rgbDepth2;
    ofPixels rgbDepth3;
    ofPixels rgbDepth4;
    int showRGB;


    float offset;
    float boost;
};
