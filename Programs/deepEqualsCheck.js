const check = (val1, val2) => {
    // Diff datatypes
    if (typeof val1 !== typeof val2) {
        return false;
    }
    //null
    if (val1 === null && val2 === null) {
        return true;
    }
    //undefined
    if (val1 === undefined && val2 === undefined) {
        return true;
    }

    // Primitive
    if (
        typeof val1 === typeof val2 &&
        (typeof val1 !== 'object' || typeof val2 !== 'object')
    ) {
        return val1 === val2;
    }

    // Arrays and objects

    // Arrays
    if (Array.isArray(val1) && Array.isArray(val2)) {
        const k1 = val1.flat(Infinity);
        const k2 = val2.flat(Infinity);

        if (k1.length !== k2.length) {
            return false;
        }

        for (let index = 0; index < k1.length; index++) {
            if (k1[index] !== k2[index]) {
                return false;
            }
        }
        return true;
    }

    // Objects
    if (
        typeof val1 === 'object' &&
        val1 !== null &&
        typeof val2 === 'object' &&
        val2 !== null
    ) {
        const k3 = Object.entries(val1).flat(Infinity);
        const k4 = Object.entries(val2).flat(Infinity);
        if (k3.length !== k4.length) {
            return false;
        }

        // console.log(k3);
        // console.log(k4);

        for (let index = 0; index < k3.length; index++) {
            if (k3[index] !== k4[index]) {
                return false;
            }
        }
        return true;
    }

    return false;
};

// True

console.log('True:');
console.log(check(1, 1));
console.log(check(BigInt(Math.pow(2, 40)), BigInt(Math.pow(2, 40))));
console.log(check(null, null));
console.log(check(undefined, undefined));
console.log(check([1, 2, 3], [1, 2, 3]));
console.log(check([1, 2, 3, [1, 23], [[1]]], [1, 2, 3, [1, 23], [[1]]]));
console.log(check({ name: 1 }, { name: 1 }));

// False
console.log('\nFalse:');
console.log(check('1', '2'));
console.log(check(null, undefined));
console.log(check(undefined, 1));
console.log(check(undefined, [1, 2, 3]));
console.log(check(undefined, { name: 1 }));
console.log(check(undefined, 1));
console.log(check(null, { name: 1 }));
console.log(check(null, [1, 2, 3]));
console.log(check(null, 1));
console.log(check([1, 2, 3], [1, 2, 3, [1, 23], [[1]]]));
console.log(check({ name: 1 }, { name: 2 }));
console.log(check({ name: 1 }, 'asda'));
