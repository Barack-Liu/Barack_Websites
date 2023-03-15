/* File: zoom_cam.js 
 *
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../../engine/index.js";

class ZoomCam {
    constructor(w, vx, controlKey) {
        this.mInUse = false;
        this.mAlwaysOn = false;
        this.mCamera = new engine.Camera([50, 50], w, // initial WC
            [vx, 600, 200, 200], 2);
        this.mCamera.configLerp(1.0, 1);
        this.mControlKey = controlKey;

        this.mXForm = null;
    }

    inUse() {
        return this.mInUse;
    }

    shouldDraw() {
        return (this.mAlwaysOn || this.mInUse);
    }

    update() {
        this.mCamera.update();
        if (engine.input.isKeyClicked(this.mControlKey))
            this.mAlwaysOn = !this.mAlwaysOn;

        if (this.mXForm !== null) {
            let p = this.mXForm.getPosition();
            this.mCamera.panTo(p[0], p[1]);
        }
    }

    draw(world) {
        if (this.shouldDraw())
            world.drawWorld(this.mCamera);
    }

    setPanTarget(p) {
        this.mXForm = p;
    }

    setInUse(t, p) {
        this.mInUse = t;
        this.setPanTarget(p);
    }
}
export default ZoomCam;