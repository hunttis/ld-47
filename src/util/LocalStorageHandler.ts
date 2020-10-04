
export const ReadLevelScoreFromLocalStorage = (levelNumber: number) => {
    const storage = window.localStorage;
    const levelData = storage.getItem(`levelscore${levelNumber}`);
    if (!levelData) {
        console.log('No Data for level!');
        return null;
    }
    return levelData;
}

export const WriteLevelScoreToLocalStorage = (levelNumber: number, score: number) => {
    const storage = window.localStorage;
    const levelScore = storage.getItem(`levelscore${levelNumber}`);
    if (!levelScore) {
        storage.setItem(`levelscore${levelNumber}`, `${score}`);
        console.log('Saving totally new score!')
    } else if (levelScore) {
        const levelScoreAmount = parseInt(levelScore);
        if (score < levelScoreAmount) {
            storage.setItem(`levelscore${levelNumber}`, `${score}`);
            console.log('Saving better score!')
        }
    }
}