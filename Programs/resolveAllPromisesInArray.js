const promiseal = (arr) => {
    var out = [];
    let c = 0;

    return new Promise((resolve, reject) => {
        arr.forEach((pro) => {
            pro.then((data) => {
                out[c] = data;
                c += 1;
                if (c === arr.length) {
                    resolve(out);
                }
            }).catch((err) => {
                reject(err);
            });
        });
    });
};

const arr = [
    Promise.resolve(2),
    // Promise.reject(2),
    Promise.resolve([1, 2, 3]),
    Promise.resolve(3)
];

promiseal(arr)
    .then((data) => {
        console.log('Resolved');
        console.log(data);
    })
    .catch((err) => {
        console.log('Rejectd');
        console.log(err);
    });
