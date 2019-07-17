// @flow

// from http://bideowego.com/base-26-conversion
// with optimisations

let alpha = "abcdefghijklmnopqrstuvwxyz".split("");

export function toInt26(str: string): number {
    var result = 0;

    // make sure we have a usable string
    str = str.toLowerCase();
    str = str.replace(/[^a-z]/g, '');

    // we're incrementing j and decrementing i
    var j = 0;
    for (var i = str.length - 1; i > -1; i--) {
        // get letters in reverse
        var char = str[i];

        // get index in alpha and compensate for
        // 0 based array
        var position = alpha.indexOf(char);
        position++;

        // the power kinda like the 10's or 100's
        // etc... position of the letter
        // when j is 0 it's 1s
        // when j is 1 it's 10s
        // etc...
        var power = Math.pow(26, j);

        // add the power and index to result
        result += power * position;
        j++;
    }

    return result;
}

export function toString26(num: number): string {
    var result = '';

    // no letters for 0 or less
    if (num < 1) {
        return result;
    }

    var quotient = num,
        remainder;

    // until we have a 0 quotient
    while (quotient !== 0) {
        // compensate for 0 based array
        var decremented = quotient - 1;

        // divide by 26
        quotient = Math.floor(decremented / 26);

        // get remainder
        remainder = decremented % 26;

        // prepend the letter at index of remainder
        result = alpha[remainder] + result;
    }

    return result;
}
