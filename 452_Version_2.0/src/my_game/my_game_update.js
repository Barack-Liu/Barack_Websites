/*
 * File: my_game_update.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";
import MyGame from "./my_game_draw.js";

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    //Left mouse botton click
    this.mDialogSet[this.mCurDialog].update(this);

    for (let i = 0; i < this.mPropertyRenderable.length; i++) {
        let str = this.mPropertyAttribute[i] + ": " + this.mProperty[i];
        this.mPropertyRenderable[i].setText(str);
    }
    // console.log(this.mCurDialog, this.mOptionSet[this.mCurDialog]);
    if (this.mOptionSet[this.mCurDialog] !== null) {
        let n =  this.mOptionSet[this.mCurDialog].length;
        for (let i = 0; i < n; i++) {
            if (this.mOptionSet[this.mCurDialog] !== null)
                this.mOptionSet[this.mCurDialog][i].update(this);
            else
                break;
        }
    }
}

export default MyGame;