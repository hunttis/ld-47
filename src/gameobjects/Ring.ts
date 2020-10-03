import { RingTextures } from "src/util/ringTextures";
import { RingData } from "./Levels";
import {Interval, overlappingIntervals} from './overlappingIntervals'

export class Ring extends Phaser.GameObjects.Sprite {
    readonly circle: Phaser.Geom.Circle
    readonly speed: number;

    entryAngle: Interval = [0, 0];
    visitedParts: Interval[] = [this.entryAngle];

    startingAngle?: number;
    playerAngle: number = 0;
    fullyTraveled = false;

    constructor(scene: Phaser.Scene, ringData: RingData, ringTextures: RingTextures) {
        super(scene, ringData.x, ringData.y, ringTextures.getTexture(ringData.radius));
        this.startingAngle = ringData.startingAngle;
        if (ringData.startingAngle) {
            this.entryAngle[0] = ringData.startingAngle
            this.entryAngle[1] = ringData.startingAngle;
        }
        this.circle = new Phaser.Geom.Circle(ringData.x, ringData.y, ringData.radius);
        this.speed = ringData.speed;
    }

    create() {
        
    }

    update() {
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

    exitRing(angle: number) {
    }

    getScore() {
        if (this.fullyTraveled) {
            return Math.PI * 2;
        }
        const intervals = overlappingIntervals(this.visitedParts)
        const score = intervals
            .reduce((s, [start, end]) => s + (end - start), 0)
        return score
    }

    revolutions() {
        const angleDistance = this.entryAngle[1] - this.entryAngle[0];
        return angleDistance / (2 * Math.PI)
    }
}
