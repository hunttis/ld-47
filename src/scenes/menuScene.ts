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
    this.scene.add("GameScene", GameScene, false);
  }

  create() {
    console.log("Menu create");

    this.createGameTitle();
    this.createStartButton();
    this.createTutorialText();

    this.events.on(this.StartGameEvent, this.startGameScene, this);

    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      console.log("key", event.key);
      this.events.emit(this.StartGameEvent);
    });
  }

  createGameTitle() {
    const cameraWidth = this.cameras.default.width;

    const text1 = this.add.text(0, 100, "Ludum Dare 47 Game", { font: "128px Arial" });
    text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    text1.x = cameraWidth / 2 - text1.width / 2;
  }

  createTutorialText() {
    const cameraWidth = this.cameras.default.width;

    const text1 = this.add.text(0, this.game.scale.height - 200, "- How to play -", { font: "48px Arial" });
    text1.setTint(0xaabbff, 0xaaffaa, 0xaaaaff, 0xffaaaa);
    text1.x = cameraWidth / 2 - text1.width / 2;

    const text2 = this.add.text(0, this.game.scale.height - 100, "", { font: "32px Arial" });
    text2.setTint(0xaabbff, 0xaaffaa, 0xaaaaff, 0xffaaaa);
    text2.setText("SPACEBAR: hop from ring to ring when near an intersection.\nTry to 'paint' as much of the rings as possible for maximum score!");
    text2.x = cameraWidth / 2 - text2.width / 2;

  }

  createStartButton() {
    const cameraWidth = this.cameras.default.width;

    const buttonCoords = {
      x: cameraWidth / 2 - 200,
      y: 400,
      width: 400,
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
    graphics.lineStyle(5, 0xff0f00, 1);
    graphics.strokeRoundedRect(
      buttonCoords.x,
      buttonCoords.y,
      buttonCoords.width,
      buttonCoords.height,
      20
    );

    const startText = this.add.text(0, buttonCoords.y, "Start", {
      font: "64px Arial",
    });
    startText.setTint(0x00ffff, 0xffffff, 0x0000ff, 0xff00f0);
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
