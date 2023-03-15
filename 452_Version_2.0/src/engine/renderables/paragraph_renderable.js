"use strict";

import FontRenderable from "./font_renderable.js";

class ParagraphRenderable {
    constructor(aString) {
        this.mTokens = aString.split(" ");
        this.mWordRenderable = [];
        this.mParagrahLengthLimit = null;
        this.mSpaceWidth = null;
        this.mStartX = null;
        this.mStartY = null;
        this.mHeight = null;
        this.mHasColored = [];

        this.mVisiable = [];
        this.mPlayInterval = 0;
        this.mLastPlayTime = 0;
        this.mPlayIndex = 0;
    }

    init() {
        for (let i = 0; i < this.mTokens.length; i++) {
            let rend;
            let str = this.mTokens[i];
            // if a token contains contains a <#6-digit-hex#> set color
            if (/^\<\#[0-9a-fA-F]{6}\#\>.+/.test(str)) {
                rend = new FontRenderable(str.substring(10));
                let r = parseInt(str.substring(2, 4), 16) / 255;
                let g = parseInt(str.substring(4, 6), 16) / 255;
                let b = parseInt(str.substring(6, 8), 16) / 255;
                rend.setColor([r, g, b, 1])
                this.mHasColored.push(i);
            }
            else
                rend = new FontRenderable(str);
            this.mWordRenderable.push(rend);
            this.mVisiable.push(this.mPlayInterval === 0 ? true : false);
        }
    }

    draw(camera) {
        for (let i = 0; i < this.mWordRenderable.length; i++) {
            if (this.mVisiable[i])
                this.mWordRenderable[i].draw(camera);
        }
    }

    update() {
        let curTime = performance.now();
        if (this.mPlayInterval > 0 && (curTime - this.mLastPlayTime) >= this.mPlayInterval 
        && this.mPlayIndex < this.mWordRenderable.length) {
            this.mVisiable[this.mPlayIndex] = true;
            this.mLastPlayTime = curTime;
            this.mPlayIndex++;
        }
    }

    setPlayInterval(i) {
        if (i > 0) {
            for (let i = 0; i < this.mWordRenderable.length; i++) {
                this.mVisiable[i] = false;
            }
            this.mPlayInterval = i;
        }
    }

    setLengthLimit(l) { 
        this.mParagrahLengthLimit = l; 
        this.arrangeText();
    }

    setPosition(x, y) {
        this.mStartX = x;
        this.mStartY = y;
        this.arrangeText();
    }

    arrangeText() {
        let curX = this.mStartX;
        let curY = this.mStartY;
        let curLen = 0;
        let row = 1;
        if (this.mParagrahLengthLimit === null) {
            for (let i = 0; i < this.mWordRenderable.length; i++) {
                this.mWordRenderable[i].getXform().setPosition(curX, curY);
                curX += (this.mWordRenderable[i].getStringWidth() + this.mSpaceWidth);
            }
        }
        else {
            for (let i = 0; i < this.mWordRenderable.length; i++) {
                this.mWordRenderable[i].getXform().setPosition(curX, curY);
                // console.log(this.mWordRenderable[i].getStringWidth(), curLen, this.mParagrahLengthLimit);
                if (this.mWordRenderable[i].getStringWidth() + curLen > this.mParagrahLengthLimit) {
                    curX = this.mStartX;
                    curY = this.mStartY - row * this.mHeight;
                    row++;
                    curLen = 0;
                }
                else {
                    curX += (this.mWordRenderable[i].getStringWidth() + this.mSpaceWidth);
                    curLen += (this.mWordRenderable[i].getStringWidth() + this.mSpaceWidth);
                }
            }
        }
    }

    setColor(c) {
        for (let i = 0; i < this.mWordRenderable.length; i++) {
            if (!this.mHasColored.includes(i))
                this.mWordRenderable[i].setColor(c);
        }
    }

    setTextHeight(h) {
        this.mHeight = h;
        for (let i = 0; i < this.mWordRenderable.length; i++) {
            this.mWordRenderable[i].setTextHeight(h);
        }
        if (this.mSpaceWidth === null) 
            this.mSpaceWidth = h/2;
    };

    setSpaceWidth(sw) { this.mSpaceWidth = sw; }
}

export default ParagraphRenderable;