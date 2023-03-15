/*
 * File: dialogue.js
 *
 * Define dialogue system
 * 
 */
"use strict";
import DialogueUI from "./dialogue_ui.js";
import DialogueText from "./dialogue_text.js";
import engine from "../index.js";
import { isButtonPressed } from "../input.js";

//Define a const parent node according to the first 'title' element
const buttonParentNode = document.querySelector('b').parentNode;

class Dialogue {
    constructor(largeBg, avatar, textBg, nameText, dialogueText) {
        //this.mRenderComponent = renderable;
        this.mVisible = false;

        this.mDialogueUI = null;
        this.mDialogueText = null;

        this.kLargeBg = largeBg;
        this.kAvatar = avatar;
        this.kTextBg = textBg;
        this.kNameBg = textBg;
        this.kDialogueText = dialogueText;
        this.kNameText = nameText;

        //Player's attribute
        this.kHealth = "";
        this.kQi = "";
        this.kAttack = "";
        this.kDefend = "";  

        this.kHealthValue = 0;
        this.kQiValue = 0;
        this.kAttackValue = 0;
        this.kDefendValue = 0;   

        //Add attribute 1
        this.kHealthAdd1 = 0;
        this.kQiAdd1 = 0;
        this.kAttackAdd1 = 0;
        this.kDefendAdd1 = 0;           

        //Add attribute 2
        this.kHealthAdd2 = 0;
        this.kQiAdd2 = 0;
        this.kAttackAdd2 = 0;
        this.kDefendAdd2 = 0; 
        
        //Add attribute 3
        this.kHealthAdd3 = 0;
        this.kQiAdd3 = 0;
        this.kAttackAdd3 = 0;
        this.kDefendAdd3 = 0; 

        this.init();
    }

    init(){
        //Init large bg
        let hLargeBg = new engine.TextureRenderable(this.kLargeBg);
        hLargeBg.getXform().setSize(178, 100);
        hLargeBg.getXform().setPosition(89, 50);
        this.mLargeBg = new engine.GameObject(hLargeBg);

        //Init avatar
        let hAvatar = new engine.TextureRenderable(this.kAvatar);
        hAvatar.getXform().setSize(40, 60);
        hAvatar.getXform().setPosition(89, 50);
        this.mAvatar = new engine.GameObject(hAvatar);
        
        //Init text bg
        let hTextFrame = new engine.TextureRenderable(this.kTextBg);
        hTextFrame.getXform().setSize(150,30);
        hTextFrame.getXform().setPosition(89, 67);
        this.mTextBg = new engine.GameObject(hTextFrame);

        //Init name bg
        let hNameFrame = new engine.TextureRenderable(this.kNameBg);
        hNameFrame.getXform().setSize(20,6);
        hNameFrame.getXform().setPosition(24, 40);
        this.mNameBg = new engine.GameObject(hNameFrame);

        //Name text
        this.mNameText = new engine.FontRenderable(this.kNameText);
        this.mNameText.setColor([0.3, 0.6, 0.9, 1]);
        this.mNameText.getXform().setPosition(21,40);
        this.mNameText.setTextHeight(3);   

        //Dialogue text 1
        this.mDialogueText1 = new engine.FontRenderable(this.kDialogueText);
        this.mDialogueText1.setColor([0.3, 0.6, 0.9, 1]);
        this.mDialogueText1.getXform().setPosition(21, 30);
        this.mDialogueText1.setTextHeight(3);    
        
        //Dialogue text 2
        this.mDialogueText2 = new engine.FontRenderable(this.kDialogueText);
        this.mDialogueText2.setColor([0.3, 0.6, 0.9, 1]);
        this.mDialogueText2.getXform().setPosition(21, 30);
        this.mDialogueText2.setTextHeight(3);   
        
         //Dialogue text 3
         this.mDialogueText3 = new engine.FontRenderable(this.kDialogueText);
         this.mDialogueText3.setColor([0.3, 0.6, 0.9, 1]);
         this.mDialogueText3.getXform().setPosition(21, 30);
         this.mDialogueText3.setTextHeight(3);   
         
         //Current Number
         this.mCurrentNumber = 1;

         //Have Option
         this.mHaveOption = false;

         //Option1
         this.mOptionText1 = "";
         this.mOptionNextNumber1 = 2;

         //Option2
         this.mOptionText2 = "";
         this.mOptionNextNumber2 = 2;
         
         //Option3
         this.mOptionText3 = "";
         this.mOptionNextNumber3 = 2; 
         
         //Check wether option is drawn
         this.mIsOptionDrawn = false;

        //Health
        this.mHealth = new engine.FontRenderable(this.kHealth);
        this.mHealth.setColor([0.1, 0.1, 0.1, 1]);
        this.mHealth.getXform().setPosition(10,95);
        this.mHealth.setTextHeight(3);     
        this.mHealth.setText("Health:" + this.kHealthValue);

        //Qi
        this.mQi = new engine.FontRenderable(this.kQi);
        this.mQi.setColor([0.1, 0.1, 0.1, 1]);
        this.mQi.getXform().setPosition(10,90);
        this.mQi.setTextHeight(3);   
        this.mQi.setText("Qi:" + this.kQiValue);        

        //Attack
        this.mAttack = new engine.FontRenderable(this.kAttack);
        this.mAttack.setColor([0.1, 0.1, 0.1, 1]);
        this.mAttack.getXform().setPosition(160,95);
        this.mAttack.setTextHeight(3);     
        this.mAttack.setText("Attack:" + this.kAttackValue);

        //Defend
        this.mDefend = new engine.FontRenderable(this.kDefend);
        this.mDefend.setColor([0.1, 0.1, 0.1, 1]);
        this.mDefend.getXform().setPosition(160,90);
        this.mDefend.setTextHeight(3);   
        this.mDefend.setText("Defend:" + this.kDefendValue); 

        //Effect mode
        this.mEffectMode1 = 0;
        this.mEffectMode2 = 0;
        this.mEffectMode3 = 0;      
        
        //Oscillate player
        this.mOscillatePlayer = null;
        this.kWidth = 40;
        this.kHeight = 60;        
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
       // const {buttonParentNode1} = window;
        
        //Check special effect
        if(this.mOscillatePlayer !== null){
            console.log("Start oscillating");

            if(this.mOscillatePlayer.done()){
                this.stopOscillatePlayer();
                this.mAvatar.getXform().setSize(this.kWidth, this.kHeight);

                console.log("When done, Avatar size:" + this.mAvatar.getXform().getSize());
            }
            else{
                let s = this.mOscillatePlayer.getNext();
                this.mAvatar.getXform().setSize(this.kWidth + s[0], this.kHeight + s[1]);
                
                console.log("During oscillating, Avatar size:" + this.mAvatar.getXform().getSize());
            }
        }

        // document.addEventListener('click', function(event){
        //     //when button 1 is clicked
        //     if(event.target.id === 'button1'){
        //         console.log("click button1");
        //         window.mIsOptionClicked1 = true;
    
        //         if((buttonParentNode1) && (buttonParentNode1.contains(button1)) && (buttonParentNode1.contains(button2)) && (buttonParentNode1.contains(button3))){    
        //             console.log("remove button");

        //             console.log("button1 before remove = " + button1);

        //             button1.remove();
        //             //button1 = undefined;
        //             button2.remove();
        //             //button2 = undefined;
        //             button3.remove();
        //             //button3 = undefined;

        //             console.log("button1 after remove = " + button1);
        //         }
        //     }
        //     //when button 2 is clicked
        //     if(event.target.id === 'button2'){
        //         console.log("click button2");
        //         window.mIsOptionClicked2 = true;
    
        //         if((buttonParentNode1) && (buttonParentNode1.contains(button1)) && (buttonParentNode1.contains(button2)) && (buttonParentNode1.contains(button3))){   
        //             buttonParentNode1.removeChild(button1);
        //             buttonParentNode1.removeChild(button2);
        //             buttonParentNode1.removeChild(button3);
        //         }
        //     }
        //     //when button 3 is clicked
        //     if(event.target.id === 'button3'){
        //         console.log("click button3");
        //         window.mIsOptionClicked3 = true;
    
        //         if((buttonParentNode1) && (buttonParentNode1.contains(button1)) && (buttonParentNode1.contains(button2)) && (buttonParentNode1.contains(button3))){    
        //             buttonParentNode1.removeChild(button1);
        //             buttonParentNode1.removeChild(button2);
        //             buttonParentNode1.removeChild(button3);
        //         }
        //     }                        
        //     //when anything but button is clicked
        //     else{
        //         //console.log("click anything but button");
        //             window.mIsOtherClicked = true;
        //     }
        // });
        
        // //When mIsOptionClicked1 is true, play certain dialogue
        // if(window.mIsOptionClicked1){
        //     this.mDialogueSet[this.mCounter].mVisible = false;

        //     //Update health
        //     this.kHealthValue += this.mDialogueSet[this.mCounter - 1].kHealthAdd1;
        //     this.mHealth.setText(this.mDialogueSet[this.mCounter - 1].kHealth + ":" + this.kHealthValue);

        //     //Update Qi
        //     this.kQiValue += this.mDialogueSet[this.mCounter - 1].kQiAdd1;
        //     this.mQi.setText(this.mDialogueSet[this.mCounter - 1].kQi + ":" + this.kQiValue);        

        //     //Update Attack
        //     this.kAttackValue += this.mDialogueSet[this.mCounter - 1].kAttackAdd1;
        //     this.mAttack.setText(this.mDialogueSet[this.mCounter - 1].kAttack + ":" + this.kAttackValue);   
            
        //     //Update Defend
        //     this.kDefendValue += this.mDialogueSet[this.mCounter - 1].kDefendAdd1;
        //     this.mDefend.setText(this.mDialogueSet[this.mCounter - 1].kDefend + ":" + this.kDefendValue);           

        //     //Effect mode 1
        //     if(this.mDialogueSet[this.mCounter - 1].mEffectMode1 == 1){
        //         this.mDialogueSet[this.mDialogueSet[this.mCounter - 1].mOptionNextNumber1 - 1].oscillatePlayer();

        //         console.log("i=" + (this.mDialogueSet[this.mCounter - 1].mOptionNextNumber1 - 1) + "mOscillatePlayer=" + this.mDialogueSet[this.mDialogueSet[this.mCounter - 1].mOptionNextNumber1 - 1].mOscillatePlayer);
        //     }

        //     //Go to next page
        //     this.mCounter = this.mDialogueSet[this.mCounter - 1].mOptionNextNumber1 - 1;

        //     this.mDialogueSet[this.mCounter].mVisible = true;
            
        //     window.mIsOptionClicked1 = false;
        // }

        // //When mIsOptionClicked2 is true, play certain dialogue
        // if(window.mIsOptionClicked2){
        //     this.mDialogueSet[this.mCounter].mVisible = false;

        //     //Update health
        //     this.kHealthValue += this.mDialogueSet[this.mCounter - 1].kHealthAdd2;
        //     this.mHealth.setText(this.mDialogueSet[this.mCounter - 1].kHealth + ":" + this.kHealthValue);

        //     //Update Qi
        //     this.kQiValue += this.mDialogueSet[this.mCounter - 1].kQiAdd2;
        //     this.mQi.setText(this.mDialogueSet[this.mCounter - 1].kQi + ":" + this.kQiValue);          

        //     //Update Attack
        //     this.kAttackValue += this.mDialogueSet[this.mCounter - 1].kAttackAdd2;
        //     this.mAttack.setText(this.mDialogueSet[this.mCounter - 1].kAttack + ":" + this.kAttackValue);   
            
        //     //Update Defend
        //     this.kDefendValue += this.mDialogueSet[this.mCounter - 1].kDefendAdd2;
        //     this.mDefend.setText(this.mDialogueSet[this.mCounter - 1].kDefend + ":" + this.kDefendValue);     

        //     //Effect mode 1
        //     if(this.mDialogueSet[this.mCounter - 1].mEffectMode2 == 1){
        //         this.mDialogueSet[this.mDialogueSet[this.mCounter - 1].mOptionNextNumber2 - 1].oscillatePlayer();
        //     }

        //     //Update next slide
        //     this.mCounter = this.mDialogueSet[this.mCounter - 1].mOptionNextNumber2 - 1;

        //     this.mDialogueSet[this.mCounter].mVisible = true;
            
        //     window.mIsOptionClicked2 = false;
        // }

        //     //When mIsOptionClicked3 is true, play certain dialogue
        //     if(window.mIsOptionClicked3){
        //         this.mDialogueSet[this.mCounter].mVisible = false;
                
        //         //Update health
        //         this.kHealthValue += this.mDialogueSet[this.mCounter - 1].kHealthAdd3;
        //         this.mHealth.setText(this.mDialogueSet[this.mCounter - 1].kHealth + ":" + this.kHealthValue);

        //         //Update Qi
        //         this.kQiValue += this.mDialogueSet[this.mCounter - 1].kQiAdd3;
        //         this.mQi.setText(this.mDialogueSet[this.mCounter - 1].kQi + ":" + this.kQiValue);           

        //         //Update Attack
        //         this.kAttackValue += this.mDialogueSet[this.mCounter - 1].kAttackAdd3;
        //         this.mAttack.setText(this.mDialogueSet[this.mCounter - 1].kAttack + ":" + this.kAttackValue);   
                
        //         //Update Defend
        //         this.kDefendValue += this.mDialogueSet[this.mCounter - 1].kDefendAdd3;
        //         this.mDefend.setText(this.mDialogueSet[this.mCounter - 1].kDefend + ":" + this.kDefendValue);             

        //         //Effect mode 1
        //         if(this.mDialogueSet[this.mCounter - 1].mEffectMode3 == 1){
        //             this.mDialogueSet[this.mDialogueSet[this.mCounter - 1].mOptionNextNumber3 - 1].oscillatePlayer();
        //         }

        //         //Update next slide
        //         this.mCounter = this.mDialogueSet[this.mCounter - 1].mOptionNextNumber3 - 1;
        //         this.mDialogueSet[this.mCounter].mVisible = true;
                
        //         window.mIsOptionClicked3 = false;
        //     }

                //When mIsOtherclicked is true, play next dialogue
            // if(window.mIsOtherClicked){
            //     if((this.mCounter < this.mDialogueSet.length)){
            //         this.mDialogueSet[this.mCounter].mVisible = true;
            //         if(this.mCounter - 1 >= 0){
            //             this.mDialogueSet[this.mCounter - 1].mVisible = false;
            //         }
            //         this.mCounter += 1;
            //     }

        //     //Update player attribute
        //     this.mHealth.setText(this.mDialogueSet[this.mCounter].kHealth + ":" + this.kHealthValue);
        //     console.log("this.mDialogueSet[this.mCounter].kHealth:" + this.mDialogueSet[this.mCounter].kHealth);
        //     this.mQi.setText(this.mDialogueSet[this.mCounter].kQi + ":" + this.kQiValue);      
        //     this.mAttack.setText(this.mDialogueSet[this.mCounter].kAttack + ":" + this.kAttackValue);   
        //     this.mDefend.setText(this.mDialogueSet[this.mCounter].kDefend + ":" + this.kDefendValue);     

        //     window.mIsOtherClicked = false;
        // }

    }

    draw(cam) {
        if (this.isVisible()) {
            this.mLargeBg.draw(cam);
            this.mAvatar.draw(cam);
            this.mTextBg.draw(cam);
            this.mNameBg.draw(cam);
            this.mNameText.draw(cam);
            this.mDialogueText1.draw(cam);
            this.mDialogueText2.draw(cam);
            this.mDialogueText3.draw(cam);

            //Draw Button
            if(this.mHaveOption && (!this.mIsOptionDrawn)){
                this.drawOption(this.mOptionText1, this.mOptionText2, this.mOptionText3);
                this.mIsOptionDrawn = true;
            }
        }
    }

    drawOption(optTex1, optTex2, optTex3){ 
            let button1 = document.createElement('button');
            button1.textContent = optTex1;
            button1.setAttribute('id', 'button1');
            button1.setAttribute('class', 'my-button');
            button1.style.fontSize = '30px';
            button1.style.width = '593px';
            button1.style.height = '100px';
            button1.style.position = 'absolute';
            button1.style.left = '593px';
            button1.style.top = '200px';
            document.body.appendChild(button1);   

            console.log("Draw option1");

            //Make ParentNode global;
            window.buttonParentNode1 = document.body;
            window.button1 = button1;
 
        //Button 2
            let button2 = document.createElement('button');
            button2.textContent = optTex2;
            button2.setAttribute('id', 'button2');
            button2.setAttribute('class', 'my-button');
            button2.style.fontSize = '30px';
            button2.style.width = '593px';
            button2.style.height = '100px';
            button2.style.position = 'absolute';
            button2.style.left = '593px';
            button2.style.top = '350px';
            document.body.appendChild(button2);

            //Make ParentNode global;
            window.button2 = button2;            

        //Button 3
            let button3 = document.createElement('button');
            button3.textContent = optTex3;
            button3.setAttribute('id', 'button3');
            button3.setAttribute('class', 'my-button');
            button3.style.fontSize = '30px';
            button3.style.width = '593px';
            button3.style.height = '100px';
            button3.style.position = 'absolute';
            button3.style.left = '593px';
            button3.style.top = '500px';
            document.body.appendChild(button3);    

            //Make ParentNode global;
            window.button3 = button3;                  
    }

    setLargeBg(larBg){
        let hLargeBg = new engine.TextureRenderable(larBg);
        hLargeBg.getXform().setSize(178, 100);
        hLargeBg.getXform().setPosition(89, 50);
        this.mLargeBg = new engine.GameObject(hLargeBg);
    }

    setAvatar(ava){
        let hAvatar = new engine.TextureRenderable(ava);
        hAvatar.getXform().setSize(40, 60);
        hAvatar.getXform().setPosition(89, 67);
        this.mAvatar = new engine.GameObject(hAvatar);
    }

    setTextBg(texBg){
        let hTextFrame = new engine.TextureRenderable(texBg);
        hTextFrame.getXform().setSize(150,30);
        hTextFrame.getXform().setPosition(89, 20);
        this.mTextBg = new engine.GameObject(hTextFrame);
    }

    setNameBg(namBg){
        let hNameFrame = new engine.TextureRenderable(namBg);
        hNameFrame.getXform().setSize(20,6);
        hNameFrame.getXform().setPosition(24, 40);
        this.mNameBg = new engine.GameObject(hNameFrame);
    }

    setNameText(namTex){
        this.mNameText = new engine.FontRenderable(namTex);
        this.mNameText.setColor([1, 0, 0, 1]);
        this.mNameText.getXform().setPosition(21,40);
        this.mNameText.setTextHeight(3);   
    }

    setDialogueText(diaTex1, diaTex2, diaTex3){
        this.mDialogueText1 = new engine.FontRenderable(diaTex1);
        this.mDialogueText1.setColor([1, 1, 1, 1]);
        this.mDialogueText1.getXform().setPosition(21, 30);
        this.mDialogueText1.setTextHeight(3);

        this.mDialogueText2 = new engine.FontRenderable(diaTex2);
        this.mDialogueText2.setColor([0, 1, 0, 1]);
        this.mDialogueText2.getXform().setPosition(21, 20);
        this.mDialogueText2.setTextHeight(3);

        this.mDialogueText3 = new engine.FontRenderable(diaTex3);
        this.mDialogueText3.setColor([1, 0, 1, 1]);
        this.mDialogueText3.getXform().setPosition(21, 10);
        this.mDialogueText3.setTextHeight(3);
    }

    setCurrentNumber(curNum){
        this.mCurrentNumber = curNum;
    }

    setHaveOption(havOpt){
        this.mHaveOption = havOpt;
    }

    setPlayerAttribute(hea, qi, att, def){
        this.kHealth = hea;
        this.kQi = qi;
        this.kAttack = att;
        this.kDefend = def;
    }

    setOption1(optTex, optNexNum, HeaTex, addHea, QiTex, addQi, AttTex, addAtt, DefTex, addDef, effMod){
        this.mOptionText1 = optTex;
        this.mOptionNextNumber1 = optNexNum;
        
        //this.kHealth = HeaTex;
        this.kHealthAdd1 = addHea;
        //this.kQi = QiTex;
        this.kQiAdd1 = addQi;
        //this.kAttack = AttTex;
        this.kAttackAdd1 = addAtt;
        //this.kDefend = DefTex;
        this.kDefendAdd1 = addDef;
        
        this.mEffectMode1 = effMod;
    }

    setOption2(optTex, optNexNum, HeaTex, addHea, QiTex, addQi, AttTex, addAtt, DefTex, addDef, effMod){
        this.mOptionText2 = optTex;
        this.mOptionNextNumber2 = optNexNum;

        //this.kHealth = HeaTex;
        this.kHealthAdd2 = addHea;
        //this.kQi = QiTex;
        this.kQiAdd2 = addQi;
        //this.kAttack = AttTex;
        this.kAttackAdd2 = addAtt;
        //this.kDefend = DefTex;
        this.kDefendAdd2 = addDef;

        this.mEffectMode2 = effMod;
    }

    setOption3(optTex, optNexNum, HeaTex, addHea, QiTex, addQi, AttTex, addAtt, DefTex, addDef, effMod){
        this.mOptionText3 = optTex;
        this.mOptionNextNumber3 = optNexNum;

        //this.kHealth = HeaTex;
        this.kHealthAdd3 = addHea;
        //this.kQi = QiTex;
        this.kQiAdd3 = addQi;
        //this.kAttack = AttTex;
        this.kAttackAdd3 = addAtt;
        //this.kDefend = DefTex;
        this.kDefendAdd3 = addDef;   

        this.mEffectMode3 = effMod;
    }

    //Oscillate player
    oscillatePlayer(){
        if(this.mOscillatePlayer == null){
            this.mOscillatePlayer = new engine.Oscillate.OscillatePosition(20, 30, 4, 180);            
        }
    }

    stopOscillatePlayer(){
        this.mOscillatePlayer = null;
    }
    

}

export default Dialogue;