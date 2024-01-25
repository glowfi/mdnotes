# Typescript

## Typescript Basics

### Compiling

```sh
tsc <name_of_file>
```

### Variables

```ts
// Explicit type defination

// Number
const a: Number = 5.45;

// Objects
interface User {
    name: String;
    id?: Number; // Optional Field
}

const obj: User = {
    name: 'asda'
};

// Adding the id field later
obj.id = 2;
```

### Functions

```ts
type AddFunc = (x: number, y: number) => number;

const add1: AddFunc = (x: number, y: number) => {
    return x + y;
};

const add2 = (obj: { a: number; b: number }) => {
    return obj.a + obj.b;
};
```

### Unions

```ts
// Unions Types
const fn = (x: string | number) => x;

console.log(fn('sad'));
console.log(fn(11));

interface Cat {
    purr: string;
}

interface Dog {
    bark: string;
}

type dog_cat = (Cat & Dog) | number;

let obj: dog_cat = {
    purr: 'purr',
    bark: 'bark'
};

obj = 5;
```

### Casting

```ts
// Use <> angular brackets
let a = 5;
console.log(<number>a);

// Use "as" keyword for casting
console.log(a as number);
```

### Any

```ts
// Input any data-type and return data as any datatype
const fn = (x: any): any => x;
```

## Typescript NodeJS

### Install Dependencies

```sh
npm init -y
npm i typescript --save-dev
npm i @types/node --save-dev
npm i nodemon ts-node --save-dev
npx tsc --init
```

### Note

-   **Files with cts must be imported with cjs [es5 using files exporting using module.exports]**
-   **Files with ts must be imported with js [es6 using files]**

> package.json

```json
"type": "module",
"scripts": {
    "build": "tsc",
    "start": "tsc --watch & node --watch dist/index.js"
},
```

> tsconfig.json

```json
{
    "compilerOptions": {
        "module": "NodeNext", // NodeNext (ES6), Commonjs (ES5)
        "moduleResolution": "NodeNext",
        "esModuleInterop": true,
        "target": "ES5", // Javascript version our ts code will be compiled to
        "sourceMap": true,
        "outDir": "dist",
        "rootDir": "src"
    },
    "include": ["src/**/*"]
}
```
