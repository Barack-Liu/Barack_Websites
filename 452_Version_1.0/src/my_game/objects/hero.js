/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";


class Hero extends engine.GameObject {
    constructor(spriteTexture, zoomCams) {
        super(null);
        this.kCycles = 120; // 2 seconds
        this.kRate = 0.05; // 10% at a time

        this.kWidth = 9;
        this.kHeight = 12;

        this.mDye = new engine.SpriteRenderable(spriteTexture);
        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(35, 50);
        this.mDye.getXform().setSize(this.kWidth, this.kHeight);
        this.mDye.setElementPixelPositions(0, 120, 0, 180);
        this.mRenderComponent = this.mDye;

        this.mZoomCams = zoomCams;
        this.mMyCam = zoomCams.getHeroCam();
        this.mMyCam.setPanTarget(this.mDye.getXform());

        let p = this.mDye.getXform().getPosition();
        this.mDye.configInterpolatePosition([p[0], p[1]]);
        this.mDye.ConfigInterpolate(this.kRate, this.kCycles);
        this.mOscillate = null;

        // DyePack support
        this.mSpriteTexture = spriteTexture;
        this.mAllDyes = new engine.GameObjectSet();
    }

    draw(camera) {
        super.draw(camera);
        this.mAllDyes.draw(camera);
    }

    oscillate() {
        if (this.mOscillate === null) {
            this.mOscillate = new engine.Oscillate.OscillatePosition(4.5, 6,  // oscillate about 1/2 of object size
                                                            4, 60); // freq=10, for about 1 second
            this.mMyCam.setInUse(true, this.getXform());
        }
    }

    stopOscillate() {
        this.mOscillate = null;
        this.mMyCam.setInUse(false, this.getXform());
    }

    getDyePacks() {
        return this.mAllDyes;
    }

    numDyePacks() {
        return this.mAllDyes.size();
    }

    dyePackHit(dyePack) {
        let c = this.mZoomCams.setToNextFreeCam(dyePack.getXform());
        dyePack.setMyCam(c);
    }
}

export default Hero;