import { Player } from "./player";

export class ScoreBoard {
    scoreText: Phaser.GameObjects.Text;

    currentScore: number = 0;

    constructor(private parent: Phaser.Scene, private player: Player) {
        this.scoreText = this.parent.add.text(10, 10, "Score", { font: "24px Arial" });
    }

    update() {
        const newScore = this.player.score
        if (newScore !== this.currentScore) {
            this.currentScore = newScore;
            this.scoreText.setText("Score: " + this.currentScore);
        }
    }

}