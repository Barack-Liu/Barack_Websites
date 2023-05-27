import engine from "../../engine/index.js";

const kWidth = 2.7;
const kHeight = 2.7;

class Treasure extends engine.GameObject {
    constructor(cx, cy, texture, type, lightSet) {
        super(null);
        this.mIsUnlocked = false;
        this.mTreasure = new engine.LightRenderable(texture);
        this.mRenderComponent = this.mTreasure;

        let i;
        for (i = 2; i < lightSet.numLights(); i++) {
            this.mTreasure.addLight(lightSet.getLightAt(i));
        }

        this.buildSprite(cx, cy);

        let rigidShape = new engine.RigidRectangle(this.getXform(), kWidth, kHeight);
        rigidShape.setMass(0);  // ensures no movements!
        rigidShape.toggleDrawBound();
        this.setRigidBody(rigidShape);
    }


    buildSprite(atX, atY) {
        this.mTreasure.getXform().setPosition(atX, atY);
        this.mTreasure.getXform().setSize(kWidth, kHeight);
        this.mTreasure.getXform().setZPos(2);
        
        //Parameter: left, right, bottom, top
        this.mTreasure.setElementPixelPositions(500, 950, 0, 450);
    }

    pressTreasure() {
        //Parameter: left, right, bottom, top
        this.mTreasure.setElementPixelPositions(0, 450, 0, 450);

        this.mIsUnlocked = true;
    }

    getTreasureState() {
        return this.mIsUnlocked;
    }
}

export default Treasure;