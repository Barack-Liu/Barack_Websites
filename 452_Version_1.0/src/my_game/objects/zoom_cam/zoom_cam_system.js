/* File: zoom_cam_system.js 
 *
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../../engine/index.js";
import ZoomCam from "./zoom_cam.js";

class ZoomCamSystem {
    constructor(theWorld) {
        this.kDyeCam = 0;  // don't touch this!

        this.mTheWorld = theWorld;

        this.kKeysToCheck = [
            engine.input.keys.Zero,
            engine.input.keys.One,
            engine.input.keys.Two,
            engine.input.keys.Three
        ];
        this.kWCSize = [15, 6, 6, 6];
        this.mCams = [];
        let vx = 0;
        for (let i = 0; i < 4; i++) {
            let c = new ZoomCam(this.kWCSize[i], vx, this.kKeysToCheck[i]);
            vx += 200;
            this.mCams.push(c);
        }
    }

    update() {
        for (let i = 0; i < 4; i++) {
            this.mCams[i].update();
        }
    }

    draw() {
        for (let i = 0; i < 4; i++) {
            this.mCams[i].draw(this.mTheWorld);
        }
    }

    getHeroCam() {
        return this.mCams[this.kDyeCam];
    }

    setToNextFreeCam(xf) {
        let cam = null;
        let i = 1;
        while ((cam === null) && (i < 4)) {
            if (!this.mCams[i].inUse()) {
                cam = this.mCams[i];
                cam.setInUse(true, xf);
            }
            i++;
        }
        return cam;
    }
}

export default ZoomCamSystem;