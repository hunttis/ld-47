// import { GameScene } from "./scenes/gameScene";
import { MenuScene } from "./scenes/menuScene";


export function startGame() {
  const config: Phaser.Types.Core.GameConfig = {
    title: "Phaser game",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 800,
    },
    physics: {
      default: "arcade",
      arcade: {
        debug: true,
      },
    },
    parent: "game",
    backgroundColor: "#0f0f0f",
    scene: new MenuScene(),
  };

  return new Phaser.Game(config);
}
