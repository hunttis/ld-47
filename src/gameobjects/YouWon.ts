export class YouWon extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    const text = this.scene.add.text(0, 0, "VICTORY!", { fontFamily: "Impact, Charcoal, sans-serif", fontSize: 48 })
    this.add(text)
    this.x -= text.width / 2
    this.y -= text.height
    text.setColor("#FFD486")
    text.setStroke('#5C4C30', 1);
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
  }
}
