import { CreateAnimations, LoadAssets } from "../util/GameLoader";
import { Levels } from "../gameobjects/Levels";
import { MouseCursor } from "../gameobjects/MouseCursor";
import { Player } from "../gameobjects/Player";
import { Ring } from "../gameobjects/Ring";
import { ScoreBoard } from "../gameobjects/ScoreBoard";
import { RingGroup } from "../groups/RingGroup";
import { RingTextures } from "../util/RingTextures";
import { YouWon } from "../gameobjects/YouWon";
import { LevelSelectScene } from "../scenes/LevelSelectScene";
import { WriteLevelScoreToLocalStorage } from "../util/LocalStorageHandler";

export class GameScene extends Phaser.Scene {
  mouseCursor!: Phaser.GameObjects.GameObject;
  ringTextures!: RingTextures;
  ringGroup!: RingGroup;
  player!: Player;
  smoke!: Phaser.GameObjects.Image;

  updateGroup!: Phaser.GameObjects.Group;
  scoreBoard!: ScoreBoard;
  youWon!: YouWon

  levels: Levels = new Levels();
  levelNumber!: number;
  endLevelTime: number = -1

  levelInitialized: boolean = false;
  soundText!: Phaser.GameObjects.Text;

  constructor() {
    super({ active: false, visible: false });
    console.log("game", this.game);
  }

  init(data: any) {
    console.log('GAME INIT');
    console.log('Got some data!', data);
    this.levelNumber = data.levelNumber;
  }

  preload() {
    console.log('GAME PRELOAD');
    this.ringTextures = new RingTextures(this);
    LoadAssets(this);
  }

  create() {
    console.log("CREATED GAMESCENE!");
    
    this.levelInitialized = false;

    var background = this.add.image(0, 0, 'gradient');
    background.setPosition(this.scale.width/2, this.scale.height/2);
    background.setDisplaySize(this.scale.width, this.scale.height);
    
    this.scoreBoard = new ScoreBoard(this);

    CreateAnimations(this);
   
    this.youWon = new YouWon(this, this.scale.width/2, this.scale.height/2)
    this.youWon.visible = false
    this.youWon.setDepth(10);
    this.add.existing(this.youWon);

    this.createSoundText();

    this.input.keyboard.on('keydown_M', () => {
      this.sound.mute = !this.sound.mute;
      console.log("Sounds on: " + this.sound.mute);
      this.soundText.setText("'M' to mute sounds. Sounds on: " + this.sound.mute);
    });

  }

  update() {
    if (!this.levelInitialized) {
      this.createLevel();
      this.levelInitialized = true;
    }

    this.ringGroup.update();
    this.cameras.main.setBackgroundColor("#aaaaaa");
    this.scoreBoard.update();

    if (this.scorePickupCount() === 0) {
      this.endLevel()
    }
  }

  endLevel() {
    if (this.endLevelTime === -1) {
      this.endLevelTime = this.time.now
      this.scoreBoard.stop();
      WriteLevelScoreToLocalStorage(this.levelNumber, this.scoreBoard.completionTime);
      this.youWon.setVisible(true);
    } else if (this.endLevelTime + 3000 < this.time.now) {
      this.scene.start("LevelSelectScene")
      this.endLevelTime = -1
    }

  }

  scorePickupCount() {
    let count = 0
    this.ringGroup.children.iterate(go => {
      const ring = go as Ring
      count += ring.scorePickups.children.size
    })
    return count
  }

  createLevel() {
    const rings = this.levels.getLevel(this.levelNumber).rings.map(ringData => {
      return new Ring(this, ringData, this.ringTextures);
    })

    this.ringGroup = new RingGroup(this, rings);
    this.add.existing(this.ringGroup);

    this.player = new Player(this, rings[0], this.ringGroup, this.scoreBoard);
    this.add.existing(this.player);

    this.updateGroup = this.add.group(
      [this.add.existing(new MouseCursor(this, this.ringGroup)), this.player],
      { runChildUpdate: true }
    );
  }

  createSoundText() {
    this.soundText = this.add.text(0, this.scale.height - 40, "", { font: "32px Arial" });
    this.soundText.setText("'M' to mute sounds. Sounds on: " + !this.sound.mute);
    this.soundText.setShadow(2, 2, '#000000', 10);
    this.soundText.x = this.scale.width - this.soundText.width - 20;
  }
}
