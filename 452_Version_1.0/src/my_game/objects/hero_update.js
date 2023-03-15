/* File: hero_update.js 
 *
 */
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Hero from "./hero.js";
import DyePack from "./dye_pack/dye_pack.js";

Hero.prototype.update = function (camera) {
    this.mDye.updateInterpolatePosition();

    if (this.mOscillate !== null) {
        if (this.mOscillate.done()) {
            this.stopOscillate();
            this.mDye.getXform().setSize(this.kWidth, this.kHeight);
        } else {
            let s = this.mOscillate.getNext();
            this.getXform().setSize(this.kWidth+s[0], this.kHeight+s[1]);
        }
    }
    
    if (camera.isMouseInViewport()) {
       // if (engine.input.isButtonPressed(engine.input.mouseButton.Left)) {
            let p = [camera.mouseWCX(), camera.mouseWCY()];
            this.mDye.setInterpolatePosition(p);
        // }
    }
    if (engine.input.isKeyClicked(engine.input.keys.Q)) {
            this.oscillate();
    }

    this.updateDyePack(camera);
}

Hero.prototype.updateDyePack = function (camera) {
    if (camera.isMouseInViewport()) {
        if (engine.input.isKeyClicked(engine.input.keys.Space)) {
            let p = this.getXform().getPosition();
            let d = new DyePack(this.mSpriteTexture, [p[0]+4.2, p[1]+2.8]);
            this.mAllDyes.addToSet(d);
        }
    }
    this.mAllDyes.update();
    let cb = camera.getWCBound(1);
    for (let i = this.mAllDyes.size()-1; i>=0; i--) {
        let d = this.mAllDyes.getObjectAt(i);
        if (d.isDead() || (!cb.intersectsBound(d.getBBox()))) {
            d.cleanDyePack();
            this.mAllDyes.mSet.splice(i, 1);  // remove one
        }
    }
}

export default Hero;