/* File: patrol.js 
 *
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../../engine/index.js";

class Patrol extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kHitOffset = 5;
        this.kAlphaOffset = 0.2;

        this.kBSize = 3;
        this.kMWidth = 4;
        this.kMHeight = 3.2;
        this.kSize = 2.5;

        this.kCycles = 120; // 2 seconds
        this.kRate = 0.05; // 10% at a time
        this.kYOffset = this.kBSize * this.kSize * 0.8;
        this.kXOffset = this.kMWidth * this.kSize;

        let x = 100 + Math.random() * 50;
        let y = 25 + Math.random() * 100;
        this.mMembers = [];

        this.mBrain = new engine.SpriteRenderable(spriteTexture);
        this.mBrain.setColor([1, 1, 1, 0]);  // tints red
        this.mBrain.getXform().setPosition(x, y);
        this.mBrain.getXform().setSize(this.kBSize * this.kSize, this.kBSize * this.kSize);
        this.mBrain.setElementPixelPositions(130, 310, 0, 180);
        this.mRenderComponent = this.mBrain;

        // The right minion
        let obj = new engine.SpriteAnimateRenderable(spriteTexture);
        obj.getXform().setSize(this.kMWidth * this.kSize, this.kMHeight * this.kSize);
        obj.getXform().setPosition(x + this.kXOffset, y - this.kYOffset);
        obj.configInterpolatePosition([x, y]);
        obj.ConfigInterpolate(this.kRate, this.kCycles);
        obj.setSpriteSequence(512, 0,     // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,       // widthxheight in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        obj.setAnimationType(engine.eAnimationType.eSwing);
        obj.setAnimationSpeed(10);       // show each element for mAnimSpeed updates
        this.mMembers.push(new engine.GameObject(obj));

        obj = new engine.SpriteAnimateRenderable(spriteTexture);
        obj.getXform().setSize(this.kMWidth * this.kSize, this.kMHeight * this.kSize);
        obj.getXform().setPosition(x + this.kXOffset, y + this.kYOffset);
        obj.configInterpolatePosition([x, y]);
        obj.ConfigInterpolate(this.kRate, this.kCycles);
        obj.setSpriteSequence(348, 0,      // first element pixel position: top-right 164 from 512 is top of image, 0 is right of image
            204, 164,       // widthxheight in pixels
            5,              // number of elements in this sequence
            0);             // horizontal padding in between
        obj.setAnimationType(engine.eAnimationType.eSwing);
        obj.setAnimationSpeed(10);           // show each element for mAnimSpeed updates
        this.mMembers.push(new engine.GameObject(obj));


        this.mSpeed = (5 + Math.random() * 5) * 1 / 60;
        let vx = -1 + 2 * Math.random();
        let vy = -1 + 2 * Math.random();
        this.setCurrentFrontDir([vx, vy]);
    }

    draw(camera) {
        this.mBrain.draw(camera);
        let i;
        for (i = 0; i < 2; i++) {
            this.mMembers[i].draw(camera);
        }

    }

    drawBounds(camera) {
        let i;
        // now draw the bbox 
        this.mBrain.getBBox().draw(camera);
        for (i = 0; i < 2; i++) {
            let b = this.mMembers[i].getBBox();
            b.draw(camera);
        }
        this.getPackBBox().draw(camera);
    }

    isDead() {
        let c1 = this.mMembers[0].getRenderable().getColor();
        let c2 = this.mMembers[1].getRenderable().getColor();
        return ((c1[3] >= 1.0) || (c2[3] >= 1.0));
    }
}

export default Patrol;
