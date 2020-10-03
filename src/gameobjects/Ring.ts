import { RingTextures } from "src/util/ringTextures";
import { RingData } from "./Levels";
import {Interval, overlappingIntervals} from './overlappingIntervals'

const generate = <T>(count: number, fn: (i: number) => T) => {
    const array = new Array(count)
    for (let i = 0; i < count; i++) {
        array[i] = fn(i)
    }
    return array
}

export class Ring extends Phaser.Physics.Arcade.Sprite {
    readonly circle: Phaser.Geom.Circle
    readonly speed: number;

    entryAngle: Interval = [0, 0];
    visitedParts: Interval[] = [this.entryAngle];

    startingAngle?: number;
    playerAngle: number = 0;
    fullyTraveled = false;

    scorePickups: Phaser.GameObjects.Group

    constructor(scene: Phaser.Scene, ringData: RingData, ringTextures: RingTextures) {
        super(scene, ringData.x, ringData.y, ringTextures.getTexture(ringData.radius));

        this.startingAngle = ringData.startingAngle;
        if (ringData.startingAngle) {
            this.entryAngle[0] = ringData.startingAngle
            this.entryAngle[1] = ringData.startingAngle;
        }
        this.circle = new Phaser.Geom.Circle(ringData.x, ringData.y, ringData.radius);
        this.speed = ringData.speed;
        if (this.speed < 0) {
            this.flipX = true;
        }

        this.scorePickups = this.scene.add.group(
            generate(ringData.scorePickups, () => this.scene.add.sprite(0, 0, 'score-pickup'))
        )
        Phaser.Actions.PlaceOnCircle(this.scorePickups.getChildren(), this.circle)
    }

    create() {
        
    }

    update() {
        this.rotation += this.speed / 20;
    }

    updatePlayerAngle(playerAngle: number) {
        if (this.revolutions() >= 1) {
            this.fullyTraveled = true
        }
        this.entryAngle[1] = playerAngle
        this.playerAngle = playerAngle
    }

    enterRing(angle: number) {
        this.entryAngle = [angle, angle];
        this.visitedParts.push(this.entryAngle)
    }

    getScore() {
        if (this.fullyTraveled) {
            return Math.PI * 2;
        }
        const intervals = overlappingIntervals(this.visitedParts)
        const score = intervals
            .reduce((s, interval) => s + intervalDistance(interval), 0)
        return score
    }

    revolutions() {
        const angleDistance = this.entryAngle[1] - this.entryAngle[0];
        return angleDistance / (2 * Math.PI)
    }
}

const intervalDistance = ([start, end]: Interval) => start > end ?
    start - end :
    end - start