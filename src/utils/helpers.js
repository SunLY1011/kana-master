export function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function getRandomItems(arr, count) {
    return shuffleArray(arr).slice(0, count);
}

export function generateOptions(correctAnswer, dataset, answerKey, count = 4) {
    const correct = dataset.find(i => i[answerKey] === correctAnswer);
    const others = dataset.filter(i => i[answerKey] !== correctAnswer);
    return shuffleArray([correct, ...getRandomItems(others, count - 1)]);
}