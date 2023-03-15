/* File: patrol_update.js 
 *
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../../engine/index.js";
import Patrol from "./patrol.js";

Patrol.prototype.getPackBBox = function () {
    let bs = this.mBrain.getBBox();
    for (let i = 0; i <2; i++) {
        let b = this.mMembers[i].getBBox();
        bs.mergeBbox(b);
    }
    bs.mHeight *= 1.5 ;
    return bs;
}

Patrol.prototype.setInterplatePositions = function () {
    let p = this.getXform().getPosition();
    this.mMembers[0].getRenderable().setInterpolatePosition([p[0]+this.kXOffset, p[1]-this.kYOffset]);
    this.mMembers[1].getRenderable().setInterpolatePosition([p[0]+this.kXOffset, p[1]+this.kYOffset]);
}
      
Patrol.prototype.update = function (camera) {
    engine.GameObject.prototype.update.call(this);
    this.setInterplatePositions();
    
    for (let i = 0; i<this.mMembers.length; i++) {
        this.mMembers[i].getRenderable().updateAnimation();
        this.mMembers[i].getRenderable().updateInterpolatePosition();
    }
    
    // collide with the world bound
    let wcBound = camera.getWCBound(1);
    let myBound = this.getPackBBox();
    if (((myBound.minX() < wcBound.minX()) && (this.mCurrentFrontDir[0] < 0)) ||
        ((myBound.maxX() > wcBound.maxX()) && (this.mCurrentFrontDir[0] > 0))) {
        this.mCurrentFrontDir[0] *= -1;
    }
        
    if (((myBound.minY() < wcBound.minY()) && (this.mCurrentFrontDir[1] < 0)) ||
        ((myBound.maxY() > wcBound.maxY()) && (this.mCurrentFrontDir[1] > 0))) {
        this.mCurrentFrontDir[1] *= -1;
    }
    
    // check to see if we are completely to the right of the camera
    if ((myBound.minX() > wcBound.maxX())) { // set sign that we are dead
        let c = this.mMembers[0].getRenderable().getColor();
        c[3] = 2;  
    }
    
    
    if (engine.input.isKeyClicked(engine.input.keys.J)) {
        let p = this.getXform().getPosition();
        p[0] += 10;
    }
}

Patrol.prototype.dyePackTest = function (dyePack) {
    let hit = false;
    let atPos = [0, 0];
    let dyeBound = dyePack.getBBox();
    let bound = this.getPackBBox();
    
    if (dyeBound.intersectsBound(bound)) {
    
        // 1. if touch element-0: push back
        if (dyePack.pixelTouches(this, atPos)) {
            let p = this.getXform().getPosition();
            p[0] += this.kHitOffset;
            hit = true;
        } 

        //  if touch element-1 or 2, change alpha 
        if (!hit) {
            let i = 0;
            while ((!hit) && (i<2)) {
                if (dyePack.pixelTouches(this.mMembers[i], atPos)) {
                    let c = this.mMembers[i].getRenderable().getColor();
                    c[3] += this.kAlphaOffset;
                    hit = true;
                }
                i++;
            }
        }
        
        if (!hit) {
            // just got inside the bound
            dyePack.slowDown();
        }
    }
    
    if (hit) 
        dyePack.hit();
     
    return hit;
}

export default Patrol;