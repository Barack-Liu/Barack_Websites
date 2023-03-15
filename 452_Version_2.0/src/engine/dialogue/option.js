import engine from "../index.js";

class Option {
    constructor() {
        this.mTag = null;
        this.mOptionCam = null;
        this.mTextRenderable = null;
        this.mCamBg = null;
        this.mFuncName = [];
        this.mArguments = [];
        this.mAllowedClicked = null;
        this.mOptionGroup = null;
    }

    init(center, width, vp) {
        // let center = dc.Center;
        // let width = dc.Width;
        // let vp = dc.Viewport;
        this.mOptionCam = new engine.Camera( 
            vec2.fromValues(center[0], center[1]),
            width,                       
            vp           
        );
        this.mOptionCam.setBackgroundColor([1, 1, 0, 1]);
        this.mAllowedClicked = 1;
    }

    setExecute(ex) {
        for (let i = 0; i < ex.length; i++) {
            this.mFuncName.push(ex[i][0]);
            this.mArguments.push(ex[i][1]);
        }
    }

    draw() {
        if (this.mAllowedClicked > 0) {
            this.mOptionCam.setViewAndCameraMatrix();
            this.mCamBg.draw(this.mOptionCam);
            this.mTextRenderable.draw(this.mOptionCam);
        }
    }

    update(myGame) {
        if(engine.input.isButtonClicked(engine.input.eMouseButton.eLeft)) {
            if (this.mOptionCam.isMouseInViewport() && this.mAllowedClicked > 0){
                if (this.mOptionGroup !== null) {
                    for (let i = 0; i < this.mOptionGroup.length; i++)
                        this.mOptionGroup[i].mAllowedClicked = 0;
                }
                else
                    this.mAllowedClicked--;
                this.execute(myGame);
            }
        }
    }

    execute(myGame) {
        for (let i = 0; i < this.mFuncName.length; i++) {
            let command = "this." + this.mFuncName[i];
            eval(command)(myGame, this.mArguments[i]);
        }
    }

    setCurDialog(myGame, arg) {
        console.log("set current dialog to", arg);
        myGame.mCurDialog = arg[0];
    }

    modifyPropertyByName(myGame, arg) {
        console.log(arg);
        let index = myGame.mPropertyAttribute.indexOf(arg[0]);
        myGame.mProperty[index] += arg[1];
    }

    modifyPropertyByIndex(myGame, index, value) {
        myGame.mProperty[index] += value;
    }

    setPropertyByName(myGame, name, value) {
        let index = myGame.mPropertyAttribute.indexOf(name);
        myGame.mProperty[index] = value;
    }

    setPropertyByIndex(myGame, index, value) {
        myGame.mProperty[index] = value;
    }

    setOptionGroup(gp) {
        this.mOptionGroup = gp;
    }

    setClickRemaining(x) { this.mAllowedClicked = x;}

    setBackgroundTexture(bgTex) {
        this.mCamBg = new engine.TextureRenderable(bgTex); 
        this.mCamBg.getXform().setPosition(this.mOptionCam.getWCCenter()[0], this.mOptionCam.getWCCenter()[1]);
        this.mCamBg.getXform().setSize(this.mOptionCam.getWCWidth(), this.mOptionCam.getWCHeight());
    }

    setParagraph(p) {
        this.mTag = p;
        this.mTextRenderable = new engine.ParagraphRenderable(p);
        this.mTextRenderable.init();
        this.mTextRenderable.setColor([0, 0, 0, 1]);
        this.mTextRenderable.setTextHeight(2);
        let wcWidth = this.mOptionCam.getWCWidth();
        console.log(wcWidth);
        this.mTextRenderable.setPosition(0-((wcWidth-4)/2), 0);
        this.mTextRenderable.setLengthLimit(wcWidth - 4);
        this.mTextRenderable.setPlayInterval(0);
    }

    getCam() {
        return this.mOptionCam;
    }
    getTag() { return this.mTextRenderable; }
}
export default Option;