import engine from "../../engine/index.js";


class HeroBullet extends engine.Particle {

    //initialize bullet properties in constructor
    constructor(kTexture, atX, atY, velX, velY, width, height) {
        super(kTexture, atX, atY, 500); //life = 500
        this.setVelocity(velX, velY);
        this.setSize(width, height);
        this.setColor([1, 1, 1, 1]); //color of bullet
        this.setSizeDelta(1);
    }

    //method to shoot bullet 
    shootBullet(mHeroState, eHeroState) {
        if (mHeroState == eHeroState.eFaceLeft || mHeroState == eHeroState.eRunLeft || mHeroState == eHeroState.eJumpLeft) {
            this.setAcceleration(-30, 0);
        }
        else if (mHeroState == eHeroState.eFaceRight || mHeroState == eHeroState.eRunRight || mHeroState == eHeroState.eJumpRight) {
            this.setAcceleration(30, 0);
        }
    }
} 

export default HeroBullet;