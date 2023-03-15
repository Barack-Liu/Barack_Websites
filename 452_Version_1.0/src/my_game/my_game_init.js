/*
 * File: my_game_init.js 
 * This is the logic of our game. 
 */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

class MyGame extends engine.Scene {
    constructor() {
        super();

        //Load transparency
        this.kTrans = "assets/transparency.png";

        //Load welcome
        this.kBg = "assets/welcome.png";
        
        //Load resources 1
        this.kBg1 = "assets/bg_1.png";
        this.kAvatar = "assets/avatar_1.png";
        this.kTextBg = "assets/dialogueFrame_1.png";
        this.kNameBg = "assets/dialogueFrame_1.png";
        this.kNameText = "Kid";
        this.kDialogueText = "Welcome to the world of Qi.";

       //Load resources 2
       this.kBg2 = "assets/bg_2.png";
       this.kAvatar2 = "assets/avatar_2.png";
       this.kTextBg2 = "assets/dialogueFrame_2.png";
       this.kNameBg2 = "assets/dialogueFrame_2.png";
       this.kNameText2 = "Didi";
       this.kDialogueText2 = "I have waited for 100 years.";      
       
       //Load resources 3
       this.kBg3 = "assets/bg_3.png";
       this.kAvatar3 = "assets/avatar_3.png";
       this.kTextBg3 = "assets/dialogueFrame_3.png";
       this.kNameBg3 = "assets/dialogueFrame_3.png";
       this.kNameText3 = "Pikachu";
       this.kDialogueText3 = "Do you want to be my master?";          

        //Load resources 4    
        this.kBg4 = "assets/bg_4.png";
        this.kAvatar4 = "assets/avatar_4.png";
        this.kTextBg4 = "assets/dialogueFrame_4.png";
        this.kNameBg4 = "assets/dialogueFrame_4.png";

        //Load resources 5    
        this.kBg5 = "assets/bg_5.png";
        this.kAvatar5 = "assets/avatar_5.png";
        this.kTextBg5 = "assets/dialogueFrame_5.png";
        this.kNameBg5 = "assets/dialogueFrame_5.png";

        //Load resources 6    
        this.kBg6 = "assets/bg_6.png";
        this.kAvatar6 = "assets/avatar_6.png";
        this.kTextBg6 = "assets/dialogueFrame_6.png";
        this.kNameBg6 = "assets/dialogueFrame_6.png";

        this.kJSONSceneFile1 = "./assets/The_Miraculous_Journey_of_a_Adventurer.json";
        this.kJSONSceneFile2 = "./assets/Final_Exam.json";
        this.kJSONSceneFile3 = "./assets/Test.json";

        // Init main camera
        this.mCamera = null;

        //Init dialogue counter
        this.mCounter = 0;

        //Init transparency
        this.mTrans = null;

        //Init dialogue system 1
        this.mBg = null;
        this.mAvatar = null;
        this.mTextBg = null;
        this.mNameBg = null;
        this.mDialogueText = null;
        this.mNameText = null;

        this.mDialogue = null;

        //Init dialogue system 2
        this.mBg2 = null;
        this.mAvatar2 = null;
        this.mTextBg2 = null;
        this.mNameBg2 = null;
        this.mDialogueText2 = null;
        this.mNameText2 = null;        
        
        this.mDialogue2 = null;

        //Init dialogue system 3
        this.mBg3 = null;
        this.mAvatar3 = null;
        this.mTextBg3 = null;
        this.mNameBg3 = null;
        this.mDialogueText3 = null;
        this.mNameText3 = null;        
        
        this.mDialogue3 = null;        

        //Init dialogue system set
        this.mDialogueSet = [];
        this.mDialogSet = [];

        //Check which option is clicked
        window.mIsOptionClicked1 = false;
        window.mIsOptionClicked2 = false;
        window.mIsOptionClicked3 = false;
        window.mIsOtherClicked = false;

        //Define a const parent node according to the first 'title' element
        //const buttonParentNode = document.querySelector('b').parentNode;

        //Define player's attributes
        this.mHealth = null;
        this.mQi = null;
        this.mAttack = null;
        this.mDefend = null;

        //Player's attribute
        this.kHealth = "Health:";
        this.kQi = "Qi:";
        this.kAttack = "Attack:";
        this.kDefend = "Defend:";  

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
    }


    load() {
        //Load welcome
        engine.texture.load(this.kBg);
                
        //Load resources 1
        engine.texture.load(this.kBg1);
        engine.texture.load(this.kAvatar);
        engine.texture.load(this.kTextBg);

        //Load resources 2
        engine.texture.load(this.kBg2);
        engine.texture.load(this.kAvatar2);
        engine.texture.load(this.kTextBg2);        
        
        //Load resources 3
        engine.texture.load(this.kBg3);
        engine.texture.load(this.kAvatar3);
        engine.texture.load(this.kTextBg3);   

        //Load resources 4
        engine.texture.load(this.kBg4);
        engine.texture.load(this.kAvatar4);
        engine.texture.load(this.kTextBg4);   
        
        //Load resources 5
        engine.texture.load(this.kBg5);
        engine.texture.load(this.kAvatar5);
        engine.texture.load(this.kTextBg5);   
        
        //Load resources 6
        engine.texture.load(this.kBg6);
        engine.texture.load(this.kAvatar6);
        engine.texture.load(this.kTextBg6);   

        //Load Json file
        engine.json.load(this.kJSONSceneFile1);
        engine.json.load(this.kJSONSceneFile2);
        engine.json.load(this.kJSONSceneFile3);

        //Load transparency
        engine.texture.load(this.kTrans);
    }

    unload() {
        //Unload welcome
        engine.texture.unload(this.kBg);

        //Unload resources 1
        engine.texture.unload(this.kBg1);
        engine.texture.unload(this.kAvatar);
        engine.texture.unload(this.kTextBg);

        //Unload resources 2
        engine.texture.unload(this.kBg2);
        engine.texture.unload(this.kAvatar2);
        engine.texture.unload(this.kTextBg2);

        //Unload resources 3
        engine.texture.unload(this.kBg3);
        engine.texture.unload(this.kAvatar3);
        engine.texture.unload(this.kTextBg3);

        //Unload resources 4
        engine.texture.unload(this.kBg4);
        engine.texture.unload(this.kAvatar4);
        engine.texture.unload(this.kTextBg4);

        //Unload resources 5
        engine.texture.unload(this.kBg5);
        engine.texture.unload(this.kAvatar5);
        engine.texture.unload(this.kTextBg5);

        //Unload resources 6
        engine.texture.unload(this.kBg6);
        engine.texture.unload(this.kAvatar6);
        engine.texture.unload(this.kTextBg6);

        //Unload Json
        engine.json.unload(this.kJSONSceneFile1);
        engine.json.unload(this.kJSONSceneFile2);
        engine.json.unload(this.kJSONSceneFile3);

        //Unload transparency
        engine.json.unload(this.kTrans);
    }

    init() {
        this.mCamera = new engine.Camera(
            vec2.fromValues(89, 50),   
            // center of the camera is (89, 50)
            178,                       
            // width of camera is 178, height is 100
            [0, 0, 1780, 1000]           
            // left lower corner is (0,0) and resolution is (1780, 1000)
        );
        this.mCamera.setBackgroundColor([1, 1, 1, 1]);
        this._setUp();

        //Parse Json
        let sceneInfo1 = engine.json.get(this.kJSONSceneFile1);
        let sceneInfo2 = engine.json.get(this.kJSONSceneFile2);
        let sceneInfo3 = engine.json.get(this.kJSONSceneFile3);
        this._parseDialogues(sceneInfo1);
        //this._parseDialogues(sceneInfo2);
        //this._parseDialog(sceneInfo3);   
    }

    //Setup initilized scene
    _setUp(){
        //Welcome image
        let bgR = new engine.TextureRenderable(this.kBg); 
        bgR.getXform().setSize(178, 100);
        bgR.getXform().setPosition(89, 50);
        this.mBg = new engine.GameObject(bgR);

        //Player attribute 1
        this.mHealth = new engine.FontRenderable(this.kHealth);
        this.mHealth.setColor([1, 0, 0, 1]);
        this.mHealth.getXform().setPosition(10,95);
        this.mHealth.setTextHeight(3);     

        //Player attribute 2
        this.mQi = new engine.FontRenderable(this.kQi);
        this.mQi.setColor([1, 0, 0, 1]);
        this.mQi.getXform().setPosition(10,90);
        this.mQi.setTextHeight(3);       

        //Player attribute 3
        this.mAttack = new engine.FontRenderable(this.kAttack);
        this.mAttack.setColor([1, 0, 0, 1]);
        this.mAttack.getXform().setPosition(150,95);
        this.mAttack.setTextHeight(3);     

        //Player attribute 4
        this.mDefend = new engine.FontRenderable(this.kDefend);
        this.mDefend.setColor([1, 0, 0, 1]);
        this.mDefend.getXform().setPosition(150,90);
        this.mDefend.setTextHeight(3);        
    }

    _parseDialog(sceneFile) {
        // for (let i = 0; i < sceneFile.DialogSet.length; i++) {
        //     let info = sceneFile.DialogSet[i];
        //     let dialog = new engine.Dialog();
            
        //     let center = info.DialogCam.CamCenter;
        //     let width = info.DialogCam.Width;
        //     let vp = info.DialogCam.Viewport;
        //     console.log(center);
            // dialog.init(center, width, vp);
        // }
    }

    _parseDialogues(sceneInfo){
        let i;
        let dialogueSet = [];

        for(i = 0; i< sceneInfo.DialogueSet.length; i++){
            dialogueSet[i] = new engine.Dialogue(this.kBg, this.kAvatar, this.kTextBg, this.kNameText, this.kDialogueText);

            dialogueSet[i].setLargeBg(sceneInfo.DialogueSet[i].LargeBg);
            dialogueSet[i].setAvatar(sceneInfo.DialogueSet[i].Avatar);
            dialogueSet[i].setTextBg(sceneInfo.DialogueSet[i].TextBg);
            dialogueSet[i].setNameBg(sceneInfo.DialogueSet[i].NameBg);
            dialogueSet[i].setNameText(sceneInfo.DialogueSet[i].NameText);
            dialogueSet[i].setDialogueText(sceneInfo.DialogueSet[i].DialogueText[0], sceneInfo.DialogueSet[i].DialogueText[1], sceneInfo.DialogueSet[i].DialogueText[2]);

            dialogueSet[i].setCurrentNumber(sceneInfo.DialogueSet[i].CurrentNumber);
            dialogueSet[i].setPlayerAttribute(sceneInfo.DialogueSet[i].PlayerAttribute[0], sceneInfo.DialogueSet[i].PlayerAttribute[1], sceneInfo.DialogueSet[i].PlayerAttribute[2], sceneInfo.DialogueSet[i].PlayerAttribute[3]);
            dialogueSet[i].setHaveOption(sceneInfo.DialogueSet[i].HaveOption);

            dialogueSet[i].setOption1(sceneInfo.DialogueSet[i].Option1[0], sceneInfo.DialogueSet[i].Option1[1], sceneInfo.DialogueSet[i].Option1[2], sceneInfo.DialogueSet[i].Option1[3], sceneInfo.DialogueSet[i].Option1[4], sceneInfo.DialogueSet[i].Option1[5], sceneInfo.DialogueSet[i].Option1[6], sceneInfo.DialogueSet[i].Option1[7], sceneInfo.DialogueSet[i].Option1[8], sceneInfo.DialogueSet[i].Option1[9], sceneInfo.DialogueSet[i].Option1[10]);
            dialogueSet[i].setOption2(sceneInfo.DialogueSet[i].Option2[0], sceneInfo.DialogueSet[i].Option2[1], sceneInfo.DialogueSet[i].Option2[2], sceneInfo.DialogueSet[i].Option2[3], sceneInfo.DialogueSet[i].Option2[4], sceneInfo.DialogueSet[i].Option2[5], sceneInfo.DialogueSet[i].Option2[6], sceneInfo.DialogueSet[i].Option2[7], sceneInfo.DialogueSet[i].Option2[8], sceneInfo.DialogueSet[i].Option2[9], sceneInfo.DialogueSet[i].Option2[10]);
            dialogueSet[i].setOption3(sceneInfo.DialogueSet[i].Option3[0], sceneInfo.DialogueSet[i].Option3[1], sceneInfo.DialogueSet[i].Option3[2], sceneInfo.DialogueSet[i].Option3[3], sceneInfo.DialogueSet[i].Option3[4], sceneInfo.DialogueSet[i].Option3[5],  sceneInfo.DialogueSet[i].Option3[6], sceneInfo.DialogueSet[i].Option3[7], sceneInfo.DialogueSet[i].Option3[8], sceneInfo.DialogueSet[i].Option3[9], sceneInfo.DialogueSet[i].Option3[10]);

            //Add the dialogue into the dialogue set
            this.mDialogueSet.push(dialogueSet[i]);

            console.log("dialogueSet" + i + ":" + dialogueSet[i].kHealth);
        }
    }
}

export default MyGame;