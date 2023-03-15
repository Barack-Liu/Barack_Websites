/*
 * File: dialogue_ui.js
 *
 * Define avatar, name frame, dialogue frame
 * 
 */
"use strict";

class DialogueUI {
    constructor(avatar, textFrame, nameFrame) {
        this.mAvatar = avatar;
        this.mTextFrame = textFrame;
        this.mNameFrame = nameFrame;
        this.mVisible = true;
        //this.mUIAvatar = texture;
        this.mUIPosX = 0;
        this.mUIPosY = 0;
        this.mUISize = 1;
    }

    getXform() { 
        return this.mRenderComponent.getXform(); 
    }

    setVisibility(f) { 
        this.mVisible = f; 
    }

    isVisible() { 
        return this.mVisible; 
    }

    getRenderable() { 
        return this.mRenderComponent; 
    }

    update() {
        // simple default behavior
        let pos = this.getXform().getPosition();
    }

    draw(aCamera) {
        if (this.isVisible()) {
            this.mText.draw(aCamera);
            this.mName.draw(aCamera);
            this.mAvatar.draw(aCamera);
            this.mTextFrame.draw(aCamera);
            this.mNameFrame.draw(aCamera);
        }
    }

}

export default DialogueUI;