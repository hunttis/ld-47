import { ReadLevelScoreFromLocalStorage } from "../util/LocalStorageHandler";
import { Levels } from "../gameobjects/Levels";
import { LoadAssets } from "../util/GameLoader";
import { GameScene } from "./gameScene";

export class LevelSelectScene extends Phaser.Scene {

    constructor() {
        super({ active: false, visible: false})
        Phaser.Scene.call(this, {key: "LevelSelectScene" });
        console.log("Level select");
    }

    preload() {
        this.load.image("gamebackground", "assets/images/gradient.png");
        LoadAssets(this);
    }

    create() {
        var background = this.add.image(0, 0, 'gamebackground');
        background.setPosition(this.scale.width/2, this.scale.height/2);
        background.setDisplaySize(this.scale.width, this.scale.height);
        const levelNumberFontSize = 48;
        const buttonSpacing = 50;

        const sceneWidth = this.game.scale.width;

        const levels = new Levels();

        const title = this.add.text(0, 80, "- Select level -", { font: "64px Arial" });
        title.setShadow(2, 2, '#000000', 10);
        title.x = sceneWidth / 2 - title.width / 2;

        Object.entries(levels.levelData).map(level => {
            const levelNumber: number = parseInt(level[0], 10);
            const levelData = level[1];
            
            const buttonWidth = 400;
            const buttonHeight = levelNumberFontSize + 30;
            const buttonX = this.scale.width / 3 - (buttonWidth / 2);
            const buttonY = 100 + levelNumber * (levelNumberFontSize + buttonSpacing) - 10

            const graphics = this.add.graphics();
            graphics.fillStyle(0x000000, 1);
            graphics.fillRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              20
            );
        
            graphics.lineGradientStyle(10, 0xffff00, 0xffff00, 0xff0000, 0xff0000, 1);
            graphics.strokeRoundedRect(
              buttonX,
              buttonY,
              buttonWidth,
              buttonHeight,
              20
            );

            const buttonText = this.add.text(buttonX + 20, buttonY + buttonHeight / 2, `Level ${levelNumber}`, { font: `${levelNumberFontSize}px Arial` });
            buttonText.y = buttonY + buttonHeight / 2 - buttonText.height / 2;
            buttonText.x = buttonX + buttonWidth / 2 - buttonText.width / 2;
            buttonText.setShadow(2, 2, '#000000', 3);

            const buttonZone = this.add
                .zone(
                    buttonX,
                    buttonY,
                    buttonWidth,
                    buttonHeight
                )
                .setOrigin(0)
                .setName(`Level${levelNumber}`)
                .setInteractive();

            const levelScore = ReadLevelScoreFromLocalStorage(levelNumber);

            console.log('Got', levelScore, 'from localStorage');
            
            const highScoreContent = levelScore ? `Best time: ${levelScore}` : 'No best time yet';

            const highScoreText = this.add.text(buttonX + 20 + buttonWidth, buttonY + buttonHeight / 2, highScoreContent, { font: `${levelNumberFontSize}px Arial` });
            highScoreText.x = buttonX + buttonWidth / 2 - 100 + buttonWidth;;
            highScoreText.y = buttonY + buttonHeight / 2 - highScoreText.height / 2;
            highScoreText.setShadow(2, 2, '#000000', 3);

    
        })

        this.input.on(
            "gameobjectdown",
            (
              pointer: Phaser.Input.Pointer,
              gameObject: Phaser.GameObjects.GameObject
            ) => {
                console.log('Clicked: ', gameObject.name);
                this.startLevel(parseInt(gameObject.name.substr(5)));
            }
        );

        this.input.keyboard.on('keydown_M', () => {
            this.sound.mute = !this.sound.mute;
        });
      
    }

    update() {
    }

    startLevel(levelNumber: number) {
        console.log('Level starting: ', levelNumber);
        this.scene.start("GameScene", {levelNumber});
    }
}