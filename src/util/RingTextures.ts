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

        const renderTextureConfig: Phaser.Types.GameObjects.RenderTexture.RenderTextureConfig = {
            width: radius*2 + 32,
            height: radius*2 + 32,
        }

        const renderTexture = this.parent.make.renderTexture(renderTextureConfig, false);
        const renderPart = this.parent.add.image(-10, -10, 'part');
        const steps = 100;

        // for (let index = 0; index < steps * 2; index++) {
        //     var dest = Phaser.Math.RotateAroundDistance({x: 100, y: 100}, radius + 16, radius + 16, Phaser.Math.DegToRad(360/(steps * 2) * index), radius);
        //     renderPart.x = dest.x;
        //     renderPart.y = dest.y;
        //     renderPart.rotation = Phaser.Math.DegToRad(360/100 * index) + Phaser.Math.DegToRad(45);
        //     renderTexture.draw(renderPart);
        // }

        for (let index = 0; index < steps; index++) {
            var dest = Phaser.Math.RotateAroundDistance({x: 100, y: 100}, radius + 16, radius + 16, Phaser.Math.DegToRad(360/steps * index), radius);
            renderPart.x = dest.x;
            renderPart.y = dest.y;
            renderPart.rotation = Phaser.Math.DegToRad(360/100 * index) + Phaser.Math.DegToRad(45);
            renderTexture.draw(renderPart);
        }

        console.log('Saving texture as', name);
        renderTexture.saveTexture(name);

        // texture.lineStyle(lineWidth, color, 1.0);
        // texture.strokeCircle(radius + lineWidth, radius + lineWidth, radius);
        // texture.generateTexture(name, radius*2 + (lineWidth * 2), radius*2 + (lineWidth * 2));
        
    }
}

