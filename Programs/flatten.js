// const arr1 = [[1, 2], [[[3, 4]]]];
// const arr2 = [1, 2, 3, [5, 6]];
// const final = [];

// const flattenArray = (arr, out) => {
//     arr.forEach((elem, _) => {
//         if (Array.isArray(elem)) {
//             flattenArray(elem, out);
//         } else {
//             out.push(elem);
//         }
//     });
// };

// // flattenArray(arr1, final);
// // console.log(final);

// const final2 = [];
// const obj = { name: 'johndoe', location: { country: 'USA' } };

// const flattenObjects = (obj, out) => {
//     for (const key in obj) {
//         if (typeof obj[key] === 'object') {
//             flattenObjects(obj[key], out);
//         } else {
//             out.push([key, obj[key]]);
//         }
//     }
// };

// flattenObjects(obj, final2);
// console.log(final2);

// const obj = [{ name: 'def' }, { name: 'ghi' }, { name: 'abc' }];

// obj.sort((a, b) => a.name.localeCompare(b.name));
// console.log(obj);

// obj[0].name.localeCompare()

const ls = [['abc', 'def'], ['hello'], ['he', '2']];

// ls.forEach((p) => {
//     console
// });

const res = [];
const k = ls.map((p) => {
    const out = p.filter((elem) => elem.includes('he'));
    if (out.length > 0) {
        res.push(out);
    }
});

console.log(res);
// console.log(k.remove(-1));
