import { RingTextures } from "../util/ringTextures";
import { RingData } from "./Levels";
import {Interval, overlappingIntervals} from './overlappingIntervals'
import {DEBUG} from '../config'

const generate = <T>(count: number, fn: (i: number) => T) => {
    const array = new Array(count)
    for (let i = 0; i < count; i++) {
        array[i] = fn(i)
    }
    return array
}

function pointEquals(a: Phaser.Types.Math.Vector2Like, b: Phaser.Types.Math.Vector2Like) {
    return a.x === b.x && a.y === b.y
}

const PI2 = Math.PI * 2
const placementPoint = new Phaser.Geom.Point(0, 0)

function placeOnCircle(items: Point[], circle: Phaser.Geom.Circle, startAngle: number = 0, endAngle: number = PI2) {
    const distance = (startAngle > endAngle) ? ((endAngle + PI2) - startAngle) : endAngle - startAngle
    let angle = startAngle;
    const angleStep = distance / items.length;

    for (var i = 0; i < items.length; i++)
    {
        const item = items[i]
        const normalizedAngle = Phaser.Math.Angle.Normalize(angle) / PI2
        circle.getPoint(normalizedAngle, placementPoint)
        item.x = placementPoint.x
        item.y = placementPoint.y

        angle += angleStep;
    }
}

export class Ring extends Phaser.Physics.Arcade.Sprite {
    readonly circle: Phaser.Geom.Circle
    readonly outerCircle: Phaser.Geom.Circle
    readonly innerCircle: Phaser.Geom.Circle
    readonly speed: number;

    entryAngle: Interval = [0, 0];
    visitedParts: Interval[] = [this.entryAngle];

    startingAngle?: number;
    playerAngle: number = 0;
    fullyTraveled = false;

    scorePickups: Phaser.GameObjects.Group

    previousMouseCoords = {x: 0, y: 0}

    constructor(scene: Phaser.Scene, ringData: RingData, ringTextures: RingTextures) {
        super(scene, ringData.x, ringData.y, ringTextures.getTexture(ringData.radius));

        this.startingAngle = ringData.startingAngle;
        if (ringData.startingAngle) {
            this.entryAngle[0] = ringData.startingAngle
            this.entryAngle[1] = ringData.startingAngle;
        }
        this.circle = new Phaser.Geom.Circle(ringData.x, ringData.y, ringData.radius);
        this.innerCircle = new Phaser.Geom.Circle(ringData.x, ringData.y, ringData.radius - 8)
        this.outerCircle = new Phaser.Geom.Circle(ringData.x, ringData.y, ringData.radius + 8)
        this.speed = ringData.speed;
        if (this.speed < 0) {
            this.flipX = true;
        }

        this.scorePickups = this.scene.add.group(
            generate(ringData.scorePickups, () => {
                var pickup = this.scene.add.sprite(0, 0, "pickup");
                pickup.anims.play("animatepickup");
                pickup.setDepth(1);
                return pickup;
            })
        )
        placeOnCircle(this.scorePickups.getChildren() as any, this.circle, ringData.scoreStartAngle, ringData.scoreEndAngle)
    }

    create() {
        
    }

    update() {
        this.rotation += this.speed / 20;

        if (DEBUG) {
            const mouse = this.scene.input.mousePointer
            if (!Phaser.Geom.Circle.ContainsPoint(this.innerCircle, mouse) &&
                Phaser.Geom.Circle.ContainsPoint(this.outerCircle, mouse)) {
                if (mouse.leftButtonDown()) {
                    console.log('ANGLE IS ', Phaser.Math.Angle.Normalize(Phaser.Math.Angle.BetweenPoints(this, mouse)).toFixed(2))
                }
                this.tint = 0x00ff00
            } else {
                this.tint = 0xffffff
            }
        }
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