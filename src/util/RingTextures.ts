import { Scene } from "phaser";

export class RingTextures {

    parent: Phaser.Scene;

    circleColor: number = 0x112233;

    constructor(scene: Phaser.Scene) {
        this.parent = scene;
    }

    getTexture(radius: number): string {
        const name: string = `circle${radius}`
        if (!this.parent.textures.exists(name)) {
            console.log(`Texture ${name} doesn't exist, creating it`);
            this.generateCircleTexture(name, radius, this.circleColor);
        }
        return name;
    }

    generateCircleTexture(name: string, radius: number, color: number) {
        console.log('Creating texture: ', name);

        const lineWidth = 3
        const texture = this.parent.make.graphics({x: 0, y: 0, add: false});
        texture.lineStyle(lineWidth, color, 1.0);
        texture.strokeCircle(radius + lineWidth, radius + lineWidth, radius);
        texture.generateTexture(name, radius*2 + (lineWidth * 2), radius*2 + (lineWidth * 2));
    }
}

