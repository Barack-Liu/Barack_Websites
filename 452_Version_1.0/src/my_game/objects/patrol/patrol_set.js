/* File: patrol_set.js 
 *
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../../engine/index.js";

import Patrol from "./patrol_update.js";

class PatrolSet extends engine.GameObjectSet {
    constructor(spriteTexture) {
        super();
        this.kSpawnPeriod = 120;

        this.mSpriteTexture = spriteTexture;
        this.mDrawBounds = false;
        this.mSpawnTime = 0;
        this.mAutoSpawn = true;
    }

    spawnNewPatrol() {
        if (this.mSpawnTime <= 0) {
            this.newPatrol();
            this.mSpawnTime = this.kSpawnPeriod + Math.random() * 60;
        } else {
            this.mSpawnTime--;
        }
    }

    getAutoSpawnMode() {
        return this.mAutoSpawn;
    }

    update(camera, hero) {
        super.update(camera);

        if (this.mAutoSpawn)
            this.spawnNewPatrol();

        if (engine.input.isKeyClicked(engine.input.keys.B))
            this.mDrawBounds = !this.mDrawBounds;

        if (engine.input.isKeyClicked(engine.input.keys.P))
            this.mAutoSpawn = !this.mAutoSpawn;


        if (engine.input.isKeyClicked(engine.input.keys.C))
            this.newPatrol();

        // patrol pack disturbing the hero
        let i;
        let hb = hero.getBBox();
        for (i = 0; i < this.size(); i++) {
            let b = this.getObjectAt(i).getBBox();
            if (hb.intersectsBound(b))
                hero.oscillate();
        }

        // hitting dyepack against patrol pack
        let ds = hero.getDyePacks();
        let j;
        for (j = 0; j < ds.size(); j++) {
            let d = ds.getObjectAt(j);
            if (d.canHit()) {
                let hasHit = false;
                i = 0;
                while ((!hasHit) && (i < this.size())) {
                    let p = this.getObjectAt(i);
                    hasHit = p.dyePackTest(d);
                    if (hasHit) {
                        hero.dyePackHit(d);
                    }
                    i++;
                }
            }
        }

        // remove ones
        for (i = this.size() - 1; i >= 0; i--) {
            let d = this.getObjectAt(i);
            if (d.isDead())
                this.mSet.splice(i, 1);
        }

    }

    draw(camera) {
        super.draw(camera);

        if (this.mDrawBounds) {
            let i;
            // now draw the bbox 
            for (i = 0; i < this.size(); i++) {
                let b = this.getObjectAt(i);
                b.drawBounds(camera);
            }
        }
    }

    newPatrol() {
        let p = new Patrol(this.mSpriteTexture);
        this.addToSet(p);
    }
}

export default PatrolSet;