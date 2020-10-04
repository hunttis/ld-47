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
        const renderTextureConfig: Phaser.Types.GameObjects.RenderTexture.RenderTextureConfig = {
            width: radius*2 + 32,
            height: radius*2 + 32,
        }

        const renderTexture = this.parent.make.renderTexture(renderTextureConfig, false);
        const renderPart = this.parent.add.image(-10, -10, 'part-synth');
        renderPart.tint = 0xffffff;

        const steps = radius / 2;

        for (let index = 0; index < steps; index++) {
            var dest = Phaser.Math.RotateAroundDistance({x: 0, y: 0}, radius + 16, radius + 16, Phaser.Math.DegToRad(360/steps * index), radius);
            renderPart.x = dest.x;
            renderPart.y = dest.y;
            renderPart.alpha = 0.8;
            renderPart.rotation = Phaser.Math.DegToRad(360/steps * index) + Phaser.Math.DegToRad(45);
            renderTexture.draw(renderPart);
        }

        renderTexture.saveTexture(name);
        renderPart.destroy();
    }
}

