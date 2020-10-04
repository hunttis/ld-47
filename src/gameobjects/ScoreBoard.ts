import { Player } from "./Player";

export class ScoreBoard extends Phaser.GameObjects.Container {
    scoreText: Phaser.GameObjects.Text;

    startTime = -1
    currentTime: number = 0;
    running = false

    constructor(private parent: Phaser.Scene) {
        super(parent, 0, 0)
        this.scoreText = this.parent.add.text(10, 10, "", { font: "24px Arial"});
        this.scoreText.setColor("0x000000");
    }

    start() {
        this.startTime = this.scene.time.now
        this.running = true
    }

    update() {
        if (this.running) {
            const time = this.scene.time.now
            const elapsed = time - this.startTime
            const formatted = (elapsed/1000).toFixed(2)
    
            this.scoreText.setText(`Time: ${formatted}s`)
        }
    }

    get completionTime() {
        const time = this.scene.time.now
        const elapsed = time - this.startTime
        const formatted = (elapsed/1000).toFixed(2)

        return parseFloat(formatted)
    }

    stop() {
        this.running = false
    }
}
