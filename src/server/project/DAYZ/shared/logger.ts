const colors = require('colors');

export function logger(color: string, ...args: string[]) {
    const text = args.toString;

    if (color === 'red') {
        console.log(colors.red(args.join(' | ')));
    }

    if (color === 'green') {
        console.log(colors.green(args.join(' | ')));
    }
}