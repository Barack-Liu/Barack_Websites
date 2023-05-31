/* File: hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

"use strict";
import engine from "../../engine/index.js";
import Health from "../objects/health.js";

let eHeroState = Object.freeze({
    eFaceRight: 0,
    eFaceLeft: 1,
    eRunRight: 2,
    eRunLeft: 3,
    eJumpRight: 4,
    eJumpLeft: 5
});

class Hero2 extends engine.GameObject {
    constructor(spriteTexture, normalMap, atX, atY, lgtSet, healthTexture, heroId) {
        super(null);
        this.kDelta = 0.1;
        this.kWidth = 2;
        this.kHeight = 8 / 3;

        this.healthTexture = healthTexture;
        this.lgtSet = lgtSet;

        if (normalMap !== null) {
            this.mDye = new engine.IllumRenderable(spriteTexture, normalMap);
        } else {
            this.mDye = new engine.LightRenderable(spriteTexture);
        }
        this.mRenderComponent = this.mDye;

        this.maxHealth = 9;
        this.currentHealth = 6;
        this.healthInterval= 0.72;
        this.healths = []
        this.lastInjuryTime = new Date().getTime();
        for (let i = 0; i < this.maxHealth; i++) {
            let health = new Health(atX, atY, healthTexture, lgtSet);
            engine.layer.addToLayer(engine.layer.eActors, health);

            this.healths.push(health)
        }

        this.mDye.setColor([1, 1, 1, 0]);
        this.mDye.getXform().setPosition(atX, atY);
        this.mDye.getXform().setZPos(1);
        this.mDye.getXform().setSize(this.kWidth, this.kHeight);

        this.mHeroState = eHeroState.eRunRight;
        this.mPreviousHeroState = eHeroState.eRunLeft;
        this.mIsMoving = false;
        this.mCanJump = false;

        this.mDye.setAnimationType(engine.eAnimationType.eLeft);
        this.mDye.setAnimationSpeed(2.5);         // show each element for mAnimSpeed updates                               


        this.mDye.addLight(lgtSet.getLightAt(2)); //jeb fix
        //this.mDye.addLight(lgtSet.getLightAt(3));
        //    this.mDye.addLight(lgtSet.getLightAt(2));

        let jxf = new engine.Transform();
        jxf.setPosition(this.mDye.getXform().getXPos(), this.mDye.getXform().getYPos() - this.kHeight / 2);
        this.mJumpBox = new engine.RigidRectangle(jxf, this.kWidth, 0.25);
        this.mJumpBox.toggleDrawBound();
        //this.setRigidBody(this.mJumpBox);

        let r = new engine.RigidRectangle(this.getXform(), this.kWidth / 1.9, this.kHeight / 1.1);
        r.setMass(0.7);
        r.setRestitution(0);
        r.setInertia(0);
        r.toggleDrawBound();
        r.setAcceleration(0, -30);
        this.setRigidBody(r);

        this.heroId = heroId;
        this.firebaseRef = firebase.database().ref('heroes/' + this.heroId);

        // Set an initial state for the hero.
        this.state = {
            xPos: atX,
            yPos: atY,
            state: eHeroState.eRunRight,
            health: this.currentHealth
        };

        // Keep track of when the state changes.
        this.stateChanged = true;

        this.firebaseRef.on('value', (snapshot) => {
            const heroData = snapshot.val();
            this.mDye.getXform().setPosition(heroData.xPos, heroData.yPos);
            this.mHeroState = heroData.state;
            this.currentHealth = heroData.health;
            // update any other necessary fields
        });
    }

    update() {
        super.update();
        // console.log('xPos:', this.mDye.getXform().getXPos());
        // console.log('yPos:', this.mDye.getXform().getYPos());
        // console.log('state:', this.mHeroState);
        // console.log('health:', this.currentHealth);
        for (let i = 0; i < this.currentHealth; i++) {
            let health = this.healths[i];
            let healthX = this.mDye.getXform().getXPos() - 1 + this.healthInterval * i;
            let healthY = this.mDye.getXform().getYPos() + this.kHeight*2/3;
            health.setPosition(healthX, healthY);
        }

        this.mJumpBox.setPosition(this.mDye.getXform().getXPos(), this.mDye.getXform().getYPos() - this.kHeight / 2);

        // control by WASD
        let xform = this.getXform();
        this.mIsMoving = false;
        let v = this.getRigidBody().getVelocity();

        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            if (this.mCanJump === true) {
                this.mPreviousHeroState = this.mHeroState;
                this.mHeroState = eHeroState.eRunLeft;
                this.mIsMoving = true;
            }

            xform.incXPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            if (this.mCanJump === true) {
                this.mPreviousHeroState = this.mHeroState;
                this.mHeroState = eHeroState.eRunRight;
                this.mIsMoving = true;
            }

            xform.incXPosBy(this.kDelta);
        }


        if (this.mCanJump === true) {
            if (this.mIsMoving === false) {
                this.mPreviousHeroState = this.mHeroState;
                if (this.mHeroState === eHeroState.eRunRight || this.mHeroState === eHeroState.eJumpRight)
                    this.mHeroState = eHeroState.eFaceRight;
                if (this.mHeroState === eHeroState.eRunLeft || this.mHeroState === eHeroState.eJumpLeft)
                    this.mHeroState = eHeroState.eFaceLeft;
            }

            if (engine.input.isKeyPressed(engine.input.keys.Up)) {
                v[1] = 20; // Jump velocity
                this.mPreviousHeroState = this.mHeroState;
                if (this.mHeroState === eHeroState.eRunRight
                    || this.mHeroState === eHeroState.eFaceRight)
                    this.mHeroState = eHeroState.eJumpRight;
                if (this.mHeroState === eHeroState.eRunLeft
                    || this.mHeroState === eHeroState.eFaceLeft)
                    this.mHeroState = eHeroState.eJumpLeft;
                this.mIsMoving = true;
            }
        }
        if (this.stateChanged) {
            this.state = {
                xPos: this.mDye.getXform().getXPos(),
                yPos: this.mDye.getXform().getYPos(),
                state: this.mHeroState,
                health: this.currentHealth
                // set any other necessary fields
            };
            this.firebaseRef.set(this.state)
                .then(() => {
                    this.stateChanged = false;
                })
                .catch(error => {
                    console.error("Error writing to Firebase: ", error);
                });
        }

        this.changeAnimation();
        this.mDye.updateAnimation();
        this.mIsMoving = false;
        this.mCanJump = false;

    }
    // Left: 37,
    // Up: 38,
    // Right: 39,
    // Down: 40,
    changeAnimation() {
        if (this.mHeroState !== this.mPreviousHeroState) {
            switch (this.mHeroState) {
                case eHeroState.eFaceLeft:
                    this.mDye.setSpriteSequence(1508, 0, 140, 180, 3, 0);
                    this.mDye.getXform().setSize(-this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(20);
                    break;
                case eHeroState.eFaceRight:
                    this.mDye.setSpriteSequence(1508, 0, 140, 180, 3, 0);
                    this.mDye.getXform().setSize(this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(20);
                    break;
                case eHeroState.eRunLeft:
                    this.mDye.setSpriteSequence(1688, 0, 140, 180, 6, 0);
                    this.mDye.getXform().setSize(-this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(5);
                    break;
                case eHeroState.eRunRight:
                    this.mDye.setSpriteSequence(1688, 0, 140, 180, 6, 0);
                    this.mDye.getXform().setSize(this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(5);
                    break;
                case eHeroState.eJumpLeft:
                    this.mDye.setSpriteSequence(2048, 0, 140, 180, 10, 0);
                    this.mDye.getXform().setSize(-this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(4);
                    break;
                case eHeroState.eJumpRight:
                    this.mDye.setSpriteSequence(2048, 0, 140, 180, 10, 0);
                    this.mDye.getXform().setSize(this.kWidth, this.kHeight);
                    this.mDye.setAnimationSpeed(4);
                    break;
            }
        }
    }

    draw(aCamera) {
        super.draw(aCamera);
        this.mJumpBox.draw(aCamera);
    }

    canJump(b) {
        this.mCanJump = b;
    }

    getJumpBox() {
        return this.mJumpBox;
    }

    getInjury(){
        let injuryTime = new Date().getTime();
        if(injuryTime - this.lastInjuryTime < 1000){
            return;
        }

        let lastHealth = this.healths[this.currentHealth - 1];
        engine.layer.removeFromLayer(engine.layer.eActors, lastHealth);
        this.healths.pop();
        this.currentHealth = this.currentHealth - 1;
        this.lastInjuryTime = injuryTime;
        this.stateChanged = true;
    }

    //Increase Hero health
    // IncreaseHealth(){
    //     let lastHealth = this.healths[this.currentHealth - 1];
    //     engine.layer.removeFromLayer(engine.layer.eActors, lastHealth);
    //     this.healths.pop();
    //     this.currentHealth = this.currentHealth + 1;
    // }

    IncreaseHealth() {
        // Ensure that health does not go beyond the maximum limit.
        if(this.currentHealth < this.maxHealth) {
            let atX = this.mDye.getXform().getXPos() - 1 + this.healthInterval * this.currentHealth;
            let atY = this.mDye.getXform().getYPos() + this.kHeight*2/3;
            
            let newHealth = new Health(atX, atY, this.healthTexture, this.lgtSet);
            
            engine.layer.addToLayer(engine.layer.eActors, newHealth);
            this.healths.push(newHealth);
            this.currentHealth = this.currentHealth + 1;
        }
        //Bug: when Hero adds 1 point health, an extral health shows up in other place
    }
        
}

export default Hero2;