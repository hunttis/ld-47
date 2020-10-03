import { RingGroup, IntersectionResult } from "../groups/RingGroup";
import { Ring } from "./Ring";

export class Player extends Phaser.GameObjects.Sprite {
  ring: Ring;
  ringAngle: number;

  private thisArray = [this];

  private jumpKey: Phaser.Input.Keyboard.Key
  private jumpLastPressed: number = 0
  private jumpModeDelay: number = 100
  private jumpIsDown = false
  private delayToStart: number;

  constructor(
    parent: Phaser.Scene,
    startingRing: Ring,
    private ringGroup: RingGroup
  ) {
    super(parent, 0, 0, "player");

    this.delayToStart = this.scene.time.now;

    this.scale = 3;
    this.alpha = 0;
    this.ring = startingRing;
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
    })

    this.scene.input.keyboard.addCapture('SPACE');

    const playerInTweenConfig: any = {
      targets: this,
      scale: 1,
      alpha: 1,
      duration: 2000,
      ease: 'Bounce.easeOut'
    } 

    this.scene.tweens.add(playerInTweenConfig)
  }

  update() {
    
    if (this.delayToStart + 2000 > this.scene.time.now) {
      return;
    }

    this.ringAngle += this.ring.speed;
    this.ring.updatePlayerAngle(this.ringAngle)
    Phaser.Actions.PlaceOnCircle(
      this.thisArray,
      this.ring.circle,
      this.ringAngle
    );

    const jumpTargets = this.jumpTargets();
    if (jumpTargets.length) {
      this.anims.play("exit");
    } else {
      this.anims.play("spin");
    }

    const now = this.scene.time.now

    const isInJumpMode = isBetween(now, this.jumpLastPressed, this.jumpLastPressed + this.jumpModeDelay)

    if (jumpTargets.length && isInJumpMode) {
      this.jump(jumpTargets);
    }
  }

  jumpTargets() {
    return this.ringGroup.findCloseIntersections(this.ring, this, 5);
  }

  jump([target]: IntersectionResult[]) {
    this.ring.exitRing(this.ringAngle)
    this.ring = target.ring
    const angle = Phaser.Math.Angle.BetweenPoints(this.ring, this)
    this.ring.enterRing(angle)
    this.ringAngle = angle;
    Phaser.Actions.PlaceOnCircle(this.thisArray, this.ring.circle, angle)
    this.jumpLastPressed = 0
  }
}

function isBetween(value: number, start: number, end: number) {
  return value >= start && value <= end
}