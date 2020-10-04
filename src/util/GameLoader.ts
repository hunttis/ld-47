export const LoadAssets = (scene: Phaser.Scene) => {

    scene.load.image("gradient", "assets/images/gradient.png");

    scene.load.image("smoke", "assets/images/smoke.png");

    scene.load.spritesheet("cursor", "assets/images/cursor.png", {
      frameWidth: 16,
      frameHeight: 16,
      endFrame: 1
    });

    scene.load.spritesheet("player", "assets/images/ship.png", {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 12
    });

    scene.load.spritesheet("pickup", "assets/images/gem-animated.png", {
      frameWidth: 16,
      frameHeight: 16,
      endFrame: 6
    });

    scene.load.image("gamebackground", "assets/images/gradient.png");

    scene.load.image("part", "assets/images/part.png");
    scene.load.image("part-synth", "assets/images/part-synth.png");
    scene.load.image("part-bak", "assets/images/part-bak.png");
    scene.load.image("part-old", "assets/images/part-old.png");

    scene.load.audio('thud', ["assets/sounds/thud.wav", "assets/sounds/thud.ogg", "assets/sounds/thud.mp3"]);
    scene.load.audio('thud2', ["assets/sounds/thud2.wav"]);
    scene.load.audio('land', ["assets/sounds/land.wav", "assets/sounds/land.ogg", "assets/sounds/land.mp3"]);
    scene.load.audio('collect', ["assets/sounds/collect.wav", "assets/sounds/collect.ogg", "assets/sounds/collect.mp3"]);
}

export const CreateAnimations = (scene: Phaser.Scene) => {
    scene.anims.create({
        key: "spin",
        frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
      });
  
    scene.anims.create({
      key: "exit",
      frames: scene.anims.generateFrameNumbers("player", { start: 1, end: 1 }),
    });

    scene.anims.create({
      key: "cursor-ok",
      frames: scene.anims.generateFrameNumbers("cursor", { start: 0, end: 0 }),
    });

    scene.anims.create({
      key: "cursor-fail",
      frames: scene.anims.generateFrameNumbers("cursor", { start: 1, end: 1 }),
    });

    scene.anims.create({
      key: "playerstop",
      frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 0}),
    });

    scene.anims.create({
      key: "playermove",
      frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 12 }),
      repeat: -1,
      frameRate: 10,
    });

    scene.anims.create({
      key: "animatepickup",
      frames: scene.anims.generateFrameNumbers("pickup", { start: 0, end: 6 }),
      repeat: -1,
      frameRate: 10,
    });
}