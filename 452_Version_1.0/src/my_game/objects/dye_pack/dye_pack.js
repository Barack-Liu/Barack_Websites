/* File: dye_pack.js 
 *
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../../engine/index.js";

class DyePack extends engine.GameObject {
    constructor(spriteTexture, p) {
        super(null);
        this.kWidth = 2;
        this.kHeight = 3.25;
        this.kLifeSpan = 300; // 5 seconds

        this.kSlowRate = 0.1;
        this.kBounceRate = 20; //
        this.kBounceDuration = 120; // about 4 seconds
        this.kBounceAmplitude = this.kWidth * 2;

        this.mMyCam = null;

        this.mDyePack = new engine.SpriteRenderable(spriteTexture);
        this.mDyePack.getXform().setPosition(p[0], p[1]);
        this.mDyePack.getXform().setSize(this.kWidth, this.kHeight);
        this.mDyePack.getXform().setRotationInDegree(90);
        this.mDyePack.setElementPixelPositions(510, 595, 23, 153);
        this.mRenderComponent = this.mDyePack;

        this.mSpeed = 120 * 1 / 60;
        this.setCurrentFrontDir([1, 0]);

        this.mShake = null;
        this.mRefPos = null;
        this.mLifeLeft = this.kLifeSpan;
    }

    update() {
        super.update();
        this.mLifeLeft--;

        if (this.mShake !== null) {
            if (this.mShake.done()) {
                this.cleanDyePack();
            } else {
                let s = this.mShake.getNext();
                this.getXform().setPosition(s[0] + this.mRefPos[0],
                    s[1] + this.mRefPos[1]);
            }
        }
        if (engine.input.isKeyClicked(engine.input.keys.S))
            this.hit();
        if (engine.input.isKeyPressed(engine.input.keys.D))
            this.slowDown();
    }

    isDead() {
        return (this.mLifeLeft < 0) || (this.mSpeed < 0);
    }

    cleanDyePack() {
        this.mLifeLeft = -1;
        this.mShake = null;
        if (this.mMyCam !== null) {
            this.mMyCam.setInUse(false, null);
            this.mMyCam = null;
        }
    }

    setMyCam(c) {
        this.mMyCam = c;
    }

    canHit() {
        return (this.mShake === null);
    }

    slowDown() {
        this.mSpeed = this.mSpeed - this.kSlowRate;
    }

    hit() {
        if (this.mShake === null) {
            this.mShake = new engine.Oscillate.OscillatePosition(this.kBounceAmplitude, 0.2,  // oscillate about 1/2 of object size
                this.kBounceRate,
                this.kBounceDuration);

            let p = this.getXform().getPosition();
            this.mRefPos = [p[0], p[1]];
            this.mSpeed = 0;
        }
    }
}

export default DyePack;