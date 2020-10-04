import { GameScene } from "./gameScene";

export class MenuScene extends Phaser.Scene {
  StartGameEvent: string = "StartGameEvent";

  constructor() {
    super({ active: false, visible: false });
    Phaser.Scene.call(this, { key: "MenuScene" });
    console.log("menu", this.game);
  }

  preload() {
    console.log("Menu preload");

    this.load.image("background", "assets/images/background.png");

    this.scene.add("GameScene", GameScene, false);
  }

  create() {
    console.log("Menu create");

    var background = this.add.image(0, 0, 'background');
    background.setPosition(this.scale.width/2, this.scale.height/2);
    background.setDisplaySize(this.scale.width, this.scale.height);

    this.createGameTitle();
    this.createStartButton();
    this.createTutorialText();

    this.events.on(this.StartGameEvent, this.startGameScene, this);

    this.input.keyboard.on("keydown_SPACE", (event: KeyboardEvent) => {
      console.log("key", event.key);
      this.events.emit(this.StartGameEvent);
    });
  }

  createGameTitle() {
    const cameraWidth = this.cameras.default.width;

    const text1 = this.add.text(0, 100, "Ludum Dare 47 Game", { font: "128px Arial" });
    text1.setTint(0xffff00, 0xffff00, 0xff0000, 0xff0000);
    text1.setShadow(2, 2, '#000000', 10);

    text1.x = cameraWidth / 2 - text1.width / 2;
  }

  createTutorialText() {
    const cameraWidth = this.cameras.default.width;

    const defaultHeight = this.game.scale.height - 500;
    const separationAmount = 40;

    const text1 = this.add.text(0, defaultHeight, "- How to play -", { font: "48px Arial" });
    text1.setShadow(2, 2, '#000000', 10);
    text1.x = cameraWidth / 2 - text1.width / 2;

    const text2 = this.add.text(0, defaultHeight + separationAmount * 2, "", { font: "32px Arial" });
    text2.setText("SPACEBAR: hop from ring to ring when near an intersection.");
    text2.setShadow(2, 2, '#000000', 10);
    text2.x = cameraWidth / 2 - text2.width / 2;

    const text3 = this.add.text(0, defaultHeight + separationAmount * 3, "", { font: "32px Arial" });
    text3.setText("Collect all the gems as quick as you can!");
    text3.setShadow(2, 2, '#000000', 10);
    text3.x = cameraWidth / 2 - text3.width / 2;

    const text4 = this.add.text(0, defaultHeight + separationAmount * 4, "", { font: "32px Arial" });
    text4.setText("Overlapping a previous route will reduce your score!");
    text4.setShadow(2, 2, '#000000', 10);
    text4.x = cameraWidth / 2 - text4.width / 2;

  }

  createStartButton() {
    const cameraWidth = this.cameras.default.width;

    const buttonCoords = {
      x: cameraWidth / 2 - 400,
      y: 650,
      width: 800,
      height: 100,
    };

    const buttonZone = this.add
      .zone(
        buttonCoords.x,
        buttonCoords.y,
        buttonCoords.width,
        buttonCoords.height
      )
      .setOrigin(0)
      .setName("StartGameButton")
      .setInteractive();

    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRoundedRect(
      buttonCoords.x,
      buttonCoords.y,
      buttonCoords.width,
      buttonCoords.height,
      20
    );

    graphics.lineGradientStyle(10, 0xffff00, 0xffff00, 0xff0000, 0xff0000, 1);
    graphics.strokeRoundedRect(
      buttonCoords.x,
      buttonCoords.y,
      buttonCoords.width,
      buttonCoords.height,
      20
    );


    const startText = this.add.text(0, buttonCoords.y, "Press SPACE to Start", {
      font: "64px Arial",
    });
    startText.setTint(0xffff00, 0xffff00, 0xff0000, 0xff0000);
    startText.x = cameraWidth / 2 - startText.width / 2;
    startText.y =
      buttonCoords.y + buttonCoords.height / 2 - startText.height / 2;

    this.input.on(
      "gameobjectdown",
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject
      ) => {
        if (gameObject.name === buttonZone.name) {
          this.events.emit(this.StartGameEvent);
        }
      }
    );
  }

  update() {
    // Menuscene update loop
  }

  startGameScene() {
    this.scene.start("GameScene");
  }
}
