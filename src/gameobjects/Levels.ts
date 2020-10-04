export interface LevelDataFormat {
    [key: string]: LevelData;
}

export interface LevelData {
    rings: RingData[];
}

export interface RingData {
    x: number;
    y: number;
    radius: number;
    speed: number;
    startingAngle?: number;
    scorePickups: number
    scoreStartAngle?: number
    scoreEndAngle?: number
}

export class Levels {
    
    levelData: LevelDataFormat = {
        1: {
            rings: [
                {x: 400, y: 450, radius: 250, speed: 0.02, startingAngle: Math.PI, scorePickups: 10},
                {x: 800, y: 350, radius: 270, speed: -0.03, scorePickups: 20},
              ]
        },
        2: {
            rings: [
                {x: 250, y: 250, radius: 200, speed: 0.02, startingAngle: Math.PI, scorePickups: 20, scoreStartAngle: 0.95, scoreEndAngle: 5.60},
                {x: 550, y: 200, radius: 150, speed: 0.02, scorePickups: 10, scoreStartAngle: 2.52, scoreEndAngle: 5.91},
                {x: 750, y: 300, radius: 150, speed: 0.02, scorePickups: 10, scoreStartAngle: 4.48, scoreEndAngle: 0.40},
                {x: 950, y: 550, radius: 200, speed: 0.02, scorePickups: 20, scoreStartAngle: 4.49, scoreEndAngle: 3.5},
                {x: 700, y: 600, radius: 120, speed: 0.02, scorePickups: 10, scoreStartAngle: 5.37, scoreEndAngle: 3.16},
                {x: 500, y: 630, radius: 100, speed: 0.02, scorePickups: 10, scoreStartAngle: 5.89, scoreEndAngle: 4.6},
                {x: 350, y: 550, radius: 150, speed: -0.02, scorePickups: 4, scoreStartAngle: 5, scoreEndAngle: 6.3},
              ]
        }
    }

    getLevel(levelNumber: number): LevelData {
        return this.levelData[levelNumber];
    }
}