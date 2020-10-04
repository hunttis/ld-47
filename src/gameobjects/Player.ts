import { RingGroup, IntersectionResult } from "../groups/RingGroup";
import { Ring } from "./Ring";
import { ScoreBoard } from "./ScoreBoard";

export class Player extends Phaser.GameObjects.Sprite {
  ring!: Ring;
  ringAngle: number;

  private thisArray = [this];

  private jumpKey: Phaser.Input.Keyboard.Key
  private jumpLastPressed: number = 0
  private jumpModeDelay: number = 150
  private jumpIsDown = false
  private delayToStart: number;
  private smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private started = false
  private lastTime = 0

  score: number = 0

  constructor(
    parent: Phaser.Scene,
    startingRing: Ring,
    private ringGroup: RingGroup,
    private scoreBoard: ScoreBoard
  ) {
    super(parent, 0, 0, "player");
    console.log('PLAYER CONSTRUCTED')
    
    this.delayToStart = this.scene.time.now;

    this.scale = 3;
    this.alpha = 0;
    this.ring = startingRing
    if (!startingRing.startingAngle) {
      console.log('WARNING! Leveldata does not have startingRing startingAngle!');
    }

    this.ringAngle = startingRing.startingAngle!;

    Phaser.Actions.PlaceOnCircle(
      this.thisArray,
      startingRing.circle,
      startingRing.startingAngle
    );

    this.jumpKey = this.scene.input.keyboard.addKey("SPACE", true);

    this.scene.input.keyboard.on('keydown_SPACE', () => {
      this.jumpLastPressed = this.scene.time.now
    });

    const smokeParticles = this.scene.add.particles('smoke');

    const smokeConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
      speed: 10,
      scale: {start: 1, end: 2},
      blendMode: 'ADD',
      alpha: {start: 1, end: 0},
      frequency: 40, 
      quantity: 2,
    }
    
    this.smokeEmitter = smokeParticles.createEmitter(smokeConfig);
    this.smokeEmitter.startFollow(this);
  
    this.scene.input.keyboard.addCapture('SPACE');
    
    this.scene.sound.play('land');

    const playerInTweenConfig: any = {
      targets: this,
      scale: 1,
      alpha: 1,
      duration: 2000,
      ease: 'Bounce.easeOut'
    }

    this.scene.tweens.add(playerInTweenConfig)
  }

  create() {
    console.log("PLAYER CREATE");
  }


  update() {
    const delta = (this.scene.time.now - this.lastTime) / 1000
    this.lastTime = this.scene.time.now
    
    if (this.delayToStart + 2000 > this.scene.time.now) {
      this.anims.play("playerstop");
      return;
    } else {
      this.start()
      this.anims.play("playermove");
    }

    this.ringAngle += this.ring.speed * delta * 90;
    this.ring.updatePlayerAngle(this.ringAngle)
    Phaser.Actions.PlaceOnCircle(
      this.thisArray,
      this.ring.circle,
      this.ringAngle
    );

    if (this.ring.speed > 0) {
      this.rotation = this.ringAngle + Math.PI;
    } else {
      this.rotation = this.ringAngle;
    }

    const jumpTargets = this.jumpTargets();

    const now = this.scene.time.now

    const isInJumpMode = isBetween(now, this.jumpLastPressed, this.jumpLastPressed + this.jumpModeDelay)

    if (jumpTargets.length && isInJumpMode) {
      this.jump(jumpTargets);
    }

    this.ring.scorePickups.children.each(this.checkScorePickupCollision as any)
  }

  start() {
    if (this.started) return
    this.started = true

    this.scoreBoard.start()
  }

  jumpTargets() {
    return this.ringGroup.findCloseIntersections(this.ring, this, 25);
  }

  jump([target]: IntersectionResult[]) {
    this.scene.sound.play('thud');
    this.ring = target.ring
    const angle = Phaser.Math.Angle.BetweenPoints(this.ring, this)
    this.ringAngle = angle;
    Phaser.Actions.PlaceOnCircle(this.thisArray, this.ring.circle, angle)
    this.jumpLastPressed = 0
  }

  checkScorePickupCollision = (scorePickup: Phaser.GameObjects.Sprite) => {
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), scorePickup.getBounds())) {
      this.score += 80
      scorePickup.destroy()
      this.scene.sound.play('collect');
    }
  }
}

function isBetween(value: number, start: number, end: number) {
  return value >= start && value <= end
}