import { RingGroup } from "src/groups/RingGroup";
import { Ring } from "./Ring";

export class ScoreBoard {
    
    parent: Phaser.Scene;
    ringGroup: RingGroup;
    scoreText: Phaser.GameObjects.Text;

    currentScore: number = 0;

    constructor(parent: Phaser.Scene, ringGroup: RingGroup) {
        this.parent = parent;
        this.ringGroup = ringGroup;
        this.scoreText = this.parent.add.text(10, 10, "Score", { font: "24px Arial" });
    }

    update() {
        var newScore: number = 0;
        this.ringGroup.rings.forEach((ring: Ring) => {
            newScore += ring.getScore();
        })

        newScore = Math.round(newScore * 1000 / (Math.PI * 2));

        if (newScore !== this.currentScore) {
            this.currentScore = newScore;
            this.scoreText.setText("Score: " + this.currentScore);
        }
    }

}