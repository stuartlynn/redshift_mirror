#include "testApp.h"

//--------------------------------------------------------------
void testApp::setup(){
    
    offset= 0;

    shader.load("shaders/shader");
    kinect.setRegistration(true);
    kinect.setDepthClipping(500, 2000);
    kinect.init();
    kinect.open();
    showRGB = 0 ;
    boost = 0.0;
    
    rgbDepth1.allocate(kinect.width, kinect.height, 3);
    rgbDepth2.allocate(kinect.width, kinect.height, 3);
    rgbDepth3.allocate(kinect.width, kinect.height, 3);
    rgbDepth4.allocate(kinect.width, kinect.height, 3);
}

//--------------------------------------------------------------
void testApp::update(){ 
    kinect.update();

    if(kinect.isFrameNewDepth()){
        
        ofPixels grey =  kinect.getDepthPixelsRef();
        
        rgbDepth2.setChannel(0,rgbDepth1.getChannel(0));
        rgbDepth3.setChannel(0,rgbDepth2.getChannel(0));
        rgbDepth4.setChannel(0,rgbDepth3.getChannel(0));
        
        rgbDepth1.setChannel(0, grey);
        
        depth1.loadData(rgbDepth1);
        depth2.loadData(rgbDepth2);
        depth3.loadData(rgbDepth3);
        depth4.loadData(rgbDepth4);
        
    }
    
    
}

//--------------------------------------------------------------
void testApp::draw(){
    shader.begin();
    shader.setUniform1f("offset", ofGetElapsedTimef() );

    shader.setUniform1f("windowHeight", 1.0*ofGetHeight());
    shader.setUniform1f("windowWidth", 1.0*ofGetWidth());
    shader.setUniform1f("kinectHeight", 1.0*kinect.height);
    shader.setUniform1f("kinectWidth", 1.0*kinect.width);
    shader.setUniform1i("showWithRGB", showRGB);
    shader.setUniform1f("boost", boost);
    
    
    shader.setUniformTexture("video",  kinect.getTextureReference(),1);
    shader.setUniformTexture("depth1",depth1,2);
    shader.setUniformTexture("depth2", depth2,3);
    shader.setUniformTexture("depth3", depth3,4);
    shader.setUniformTexture("depth4", depth4,5);

    ofRect(0, 0, ofGetWidth(), ofGetHeight());
    shader.end();
}

//--------------------------------------------------------------
void testApp::keyPressed(int key){
    
    if(key == ' '){
        showRGB = !showRGB;
    }
    else if (key == ']'){
        boost+= 10.0;
    }
    else if (key=='['){
        boost += 10.0;
    }
    
}

//--------------------------------------------------------------
void testApp::keyReleased(int key){
    
}

//--------------------------------------------------------------
void testApp::mouseMoved(int x, int y ){
    
}

//--------------------------------------------------------------
void testApp::mouseDragged(int x, int y, int button){
    
}

//--------------------------------------------------------------
void testApp::mousePressed(int x, int y, int button){
    
}

//--------------------------------------------------------------
void testApp::mouseReleased(int x, int y, int button){
    
}

//--------------------------------------------------------------
void testApp::windowResized(int w, int h){
    
}

//--------------------------------------------------------------
void testApp::gotMessage(ofMessage msg){
    
}

//--------------------------------------------------------------
void testApp::dragEvent(ofDragInfo dragInfo){
    
}
