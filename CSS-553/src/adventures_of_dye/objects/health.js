import engine from "../../engine/index.js";

const kWidth = 0.7;
const kHeight = 0.7;

class Health extends engine.GameObject {
    constructor(cx, cy, texture, lightSet) {
        super(null);
        this.mIsUnlocked = false;
        this.mHealth = new engine.LightRenderable(texture);
        this.mRenderComponent = this.mHealth;

        let i;
        for (i = 2; i < lightSet.numLights(); i++) {
            this.mHealth.addLight(lightSet.getLightAt(i));
        }

        this.buildSprite(cx, cy);

        let rigidShape = new engine.RigidRectangle(this.getXform(), kWidth, kHeight);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.toggleDrawBound();
        this.setRigidBody(rigidShape);
    }


    buildSprite(atX, atY) {        
        this.mHealth.getXform().setPosition(atX, atY);
        this.mHealth.getXform().setSize(kWidth, kHeight);
        this.mHealth.getXform().setZPos(2);
        this.mHealth.setElementPixelPositions(0, 105, 0, 100);
    }

    setPosition(atX, atY) {        
        this.mHealth.getXform().setPosition(atX, atY);
    }
}

export default Health;