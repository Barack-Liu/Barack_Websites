/*
 * File: renderable.js
 *
 * Encapsulate the Shader and vertexBuffer into the same object (and will include
 * other attributes later) to represent a Renderable object on the game screen.
 */
"use strict";

import * as glSys from "../core/gl.js";
import Transform from "../utils/transform.js";
import * as shaderResources from "../core/shader_resources.js";
import LerpVec2 from "../utils/lerp_vec2.js";
import BoundingBox from "../utils/bounding_box.js";

class Renderable {
    constructor() {
        this.mShader = shaderResources.getConstColorShader();  // get the constant color shader
        this.mXform = new Transform(); // transform that moves this object around
        this.mColor = [1, 1, 1, 1];    // color of pixel

        this.mInterpolatePosition = new LerpVec2([0, 0], 10, 10);
    }

    draw(camera) {
        let gl = glSys.get();
        this.mShader.activate(this.mColor, this.mXform.getTRSMatrix(), camera.getCameraMatrix());  // always activate the shader first!
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    getXform() { return this.mXform; }
    setColor(color) { this.mColor = color; }
    getColor() { return this.mColor; }

    // this is private/protected
    _setShader(s) {
        this.mShader = s;
    }

    getBBox() {
        var xf = this.getXform();
        return new BoundingBox(xf.getPosition(), xf.getWidth(), xf.getHeight());
    }
    
    // position interpolation support
    ConfigInterpolate(stiff, duration) {
        this.mInterpolatePosition.config(stiff, duration);
    }

    configInterpolatePosition(p) {
        this.mInterpolatePosition.setCurrent(p);
    }

    setInterpolatePosition(p) {
        this.mInterpolatePosition.setFinal(p);
    }

    updateInterpolatePosition() {
        this.mInterpolatePosition.update();
        var p = this.mInterpolatePosition.get();
        this.getXform().setPosition(p[0], p[1]);
    }
}

export default Renderable;