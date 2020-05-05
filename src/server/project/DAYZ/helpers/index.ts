// получить случайное число (min-max).
function randomInteger(min, max): number {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export {
    randomInteger,
}