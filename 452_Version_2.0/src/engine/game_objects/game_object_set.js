/*
 * File: game_object_set.js
 *
 * utility class for a collection of GameObject
 * 
 */
"use strict";

class GameObjectSet {
    constructor() {
        this.mSet = [];
    }

    size() { return this.mSet.length; }

    getObjectAt(index) {
        return this.mSet[index];
    }

    addToSet(obj) {
        this.mSet.push(obj);
    }

    removeFromSet(obj) {
        let index = this.mSet.indexOf(obj);
        if (index > -1)
            this.mSet.splice(index, 1);
    }
    
    update(camera) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].update(camera);
        }
    }

    draw(aCamera) {
        let i;
        for (i = 0; i < this.mSet.length; i++) {
            this.mSet[i].draw(aCamera);
        }
    }
}

export default GameObjectSet;