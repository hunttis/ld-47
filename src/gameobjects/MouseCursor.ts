import { RingGroup } from "src/groups/RingGroup"

export class MouseCursor extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, private ringGroup: RingGroup) {
    super(scene, 0, 0, 'cursor')
  }

  update() {
    this.x = this.scene.input.mousePointer.x
    this.y = this.scene.input.mousePointer.y

    const closeToMouse = this.ringGroup.rings
      .some(ring => this.ringGroup.findCloseIntersections(ring, this, 10).length)
    if (closeToMouse) {
      this.anims.play('cursor-ok')
    } else {
      this.anims.play('cursor-fail')
    }
  }
}
