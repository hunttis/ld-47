import { Levels } from "./gameobjects/Levels";
import { MouseCursor } from "./gameobjects/MouseCursor";
import { Player } from "./gameobjects/player";
import { Ring } from "./gameobjects/Ring";
import { ScoreBoard } from "./gameobjects/ScoreBoard";
import { RingGroup } from "./groups/RingGroup";
import { RingTextures } from "./util/RingTextures";
import { CreateAnimations, LoadAssets } from "./util/GameLoader";

export function startGame() {
  const config: Phaser.Types.Core.GameConfig = {
    title: "Phaser game",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 800,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
      },
    },
    parent: "game",
    backgroundColor: "#C724B1",
    scene: new SceneA(),
  };

  return new Phaser.Game(config);
}

export class SceneA extends Phaser.Scene {
  mouseCursor!: Phaser.GameObjects.GameObject;
  ringTextures!: RingTextures;
  ringGroup!: RingGroup;
  player!: Player;
  playerTrail!: Phaser.GameObjects.RenderTexture;
  smoke!: Phaser.GameObjects.Image;

  updateGroup!: Phaser.GameObjects.Group;
  scoreBoard!: ScoreBoard;

  levels: Levels = new Levels();

  constructor() {
    super({ active: false, visible: false });
    console.log("game", this.game);
  }

  preload() {
    this.ringTextures = new RingTextures(this);
    LoadAssets(this);
  }

  create() {
    focus();
    console.log("Textures", this.textures.getTextureKeys());

    this.playerTrail = this.add.renderTexture(0, 0, this.scale.gameSize.width, this.scale.gameSize.height);
    this.playerTrail.setBlendMode(Phaser.BlendModes.SATURATION);

    this.smoke = this.add.image(-10, -10, "smoke");
    this.smoke.setScale(1.3, 1.3);

    CreateAnimations(this);
    this.createLevel();

    console.log("CREATE!", this.game);

    this.scoreBoard = new ScoreBoard(this, this.player);
  }

  update() {
    this.ringGroup.update();
    this.cameras.main.setBackgroundColor("#55aaff");
    this.playerTrail.draw(this.smoke, this.player.x, this.player.y);
    this.scoreBoard.update();
  }

  createLevel() {
    const rings = this.levels.getLevel(2).rings.map(ringData => {
      return new Ring(this, ringData, this.ringTextures);
    })

    this.ringGroup = new RingGroup(this, rings);
    this.add.existing(this.ringGroup);

    this.player = new Player(this, rings[0], this.ringGroup);
    this.add.existing(this.player);

    this.updateGroup = this.add.group(
      [this.add.existing(new MouseCursor(this, this.ringGroup)), this.player],
      { runChildUpdate: true }
    );
  }
}
