import engine from "../index.js";

class Dialog {
    constructor() {
        this.mDialogCam = null;
        this.mCamBg = null;
        this.mNameCam = null;
        this.mNameBg = null;
        this.mNameRenderable = null;
        this.mAvatar = null;
        this.mTextRenderable = null;
        this.mNextDialog = null;
    }

    init(center, width, vp) {
        // console.log(center, width, vp);
        // let center = dc.Center;
        // let width = dc.Width;
        // let vp = dc.Viewport;
        this.mDialogCam = new engine.Camera( 
            vec2.fromValues(center[0], center[1]),
            width,
            vp
        );
        this.mDialogCam.setBackgroundColor([1, 1, 0, 1]);


        // Avatar
    }

    draw(cam) {
        // cam.setViewAndCameraMatrix();
        this.mAvatar.draw(cam);

        this.mDialogCam.setViewAndCameraMatrix();
        this.mCamBg.draw(this.mDialogCam);
        this.mTextRenderable.draw(this.mDialogCam);

        this.mNameCam.setViewAndCameraMatrix();
        this.mNameBg.draw(this.mNameCam);
        this.mNameRenderable.draw(this.mNameCam);
    }

    update() {
        this.mTextRenderable.update();
    }

    setAvatar(avatar) {
        this.mAvatar = new engine.TextureRenderable(avatar);
        this.mAvatar.getXform().setSize(40, 60);
        this.mAvatar.getXform().setPosition(89, 67);
    }

    setName(name, gap = 0) {
        // A font renderable for displaying avatar name
        this.mNameRenderable = new engine.FontRenderable(name);
        this.mNameRenderable.setTextHeight(2);
        this.mNameRenderable.setColor([1, 1, 1, 1]);
        this.mNameRenderable.getXform().setPosition(0, 0);
        let w = this.mNameRenderable.getStringWidth();
        let wid = this.mDialogCam.getWCWidth();
        
        let vp = this.mDialogCam.getViewport();
        let px = 200;
        let btltX = vp[0], btltY = vp[1] + vp[3] + gap;
        console.log(px / (vp[2] / wid), vp[2] / wid);
        console.log(w, btltX, btltY);
        this.mNameCam = new engine.Camera( 
            vec2.fromValues(0, 0),
            px / (vp[2] / wid),
            [btltX, btltY, px, 80]
        );
        this.mNameCam.setBackgroundColor[0, 0, 0, 1];
    }

    setNameTexture(tex) {
        this.mNameBg = new engine.TextureRenderable(tex);
        this.mNameBg.getXform().setPosition(this.mNameCam.getWCCenter()[0], this.mNameCam.getWCCenter()[1]);
        this.mNameBg.getXform().setSize(this.mNameCam.getWCWidth(), this.mNameCam.getWCHeight());
    }

    setBackgroundTexture(bgTex) {
        this.mCamBg = new engine.TextureRenderable(bgTex); 
        this.mCamBg.getXform().setPosition(this.mDialogCam.getWCCenter()[0], this.mDialogCam.getWCCenter()[1]);
        this.mCamBg.getXform().setSize(this.mDialogCam.getWCWidth(), this.mDialogCam.getWCHeight());
    }

    
    
    setParagraph(p) {
        this.mTextRenderable = new engine.ParagraphRenderable(p);
        this.mTextRenderable.init();
        this.mTextRenderable.setColor([1, 1, 1, 1]);
        this.mTextRenderable.setTextHeight(2);
        this.mTextRenderable.setPosition(2, 28);
        this.mTextRenderable.setLengthLimit(92);
        this.mTextRenderable.setPlayInterval(30);
    }
    // Set camera attribute
    setWidth(w) { this.mDialogCam.setWCWidth(w); }
    setViewport(vp) { this.mDialogCam.setViewport(vp); }
    setCenter(center) { this.mDialogCam.setWCCenter(center); }

    getCam() { return this.mDialogCam; }
    getParagraph() { return this.mTextRenderable; }
    getBg() { return this.mCamBg; }
    getAvatar() { return this.mAvatar; }

}

export default Dialog;