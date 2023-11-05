# Node I

> What is nodejs ?

-   Environment to run JS outside browser
-   Built on chromes V8 engine
-   Both Frontend and Backend can be written in javascript
-   It provides a way to build scalable and high-performance applications using JavaScript on the server-side

> Difference b/w Browser js & NodeJS

| Browser js                                   | nodejs                       |
| -------------------------------------------- | ---------------------------- |
| Acess to browser APIs like DOM,window object | No access to browser APIs    |
| Use to make Interactive Apps                 | Use to make Server side Apps |
| No filesystem                                | Has access to filesystem     |
| Depends on users browser's version           | Depends on NodeJS version    |
| ES6 modules                                  | CommonJS                     |

### Globals

-   \_\_dirname - path to current directory
-   \_\_filename - file name
-   require - function to use modules (CommonJS)
-   module - info about current module (file)
-   process - info about env where the program is being executed

> What are modules in nodejs ?

Modules in Node.js are reusable pieces of code that can
be imported and used in other parts of a program

-   Encapsulated Code (only sahre minimum)
-   Every file in NodeJS is module by default

### Modules

**Example to show module export import**

> utils.js

```js
// Exporting with custom name

module.exports.name = 'johndoe';

// Exporting directly

module.exports = { name: 'johndoe', id: 3 };

// Returns an object with many properties but we are interested in exports property

console.log(module);
```

**Note: Whenever we import a module we execute the module**

> app.js

```js
const data = require('./utils');

// Will return all the things in exports
console.log(data);
```

### Common inbuilt modules

-   os
-   path
-   fs
-   http

#### Path module basics

```js
const path = require('path');

// returns platform specific path delimter
// For Windows -> \
// For Linux,Mac,BSD -> /
console.log(path.sep);

// Joins the path with platform specific delimeter
const filePath = path.join(`${path.sep}folder`, 'subfolder', 'test.txt');
console.log(filePath);

// Get basename [end name]
console.log(path.basename(filePath));

// Absolute path

// Returns directory of package.json of current project
console.log(__dirname);
console.log(path.resolve(__dirname, 'folder', 'subfolder', 'test.txt'));
```

#### fs sync module

```js
const { readFileSync, writeFileSync } = require('fs');
console.log('start');
const first = readFileSync('./content/first.txt', 'utf8');
const second = readFileSync('./content/second.txt', 'utf8');

writeFileSync(
    './content/result-sync.txt',
    `Here is the result : ${first}, ${second}`,
    { flag: 'a' }
);
console.log('done with this task');
console.log('starting the next one');
```

#### fs async module

```js
const { writeFile, readFile } = require('fs');

console.log('Start ..');

readFile('./content/first.txt', 'utf-8', (err, res) => {
    if (err) {
        console.log(err);
        return;
    }
    const first = res;
    console.log(first);
    readFile('./content/second.txt', 'utf-8', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        const sec = res;
        console.log(sec);
        writeFile(
            './content/result-async.txt',
            `${first} ${sec}`,
            {
                flag: 'a'
            },
            (err, res) => {
                if (err) {
                    return;
                }
                console.log('done with the task');
            }
        );
    });
});

console.log('End');
```

#### HTTP Module

**Note : Must use end connection otherwise page wull not paint**

```js
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.write('Home Page');
        res.end();
    } else if (req.url === '/about') {
        res.end(`
            <h1> About Page</h1 >
        `);
    } else {
        res.end(
            `<h1>Page does not exists! <a href="/">Go back to Home Page</a></h1>`
        );
    }
});

server.listen(5000, () => {
    console.log('Server started ....');
});
```

### Event loop

**Every time we have a synchronous action its going to be offloaded
and when its time we invokt the callback.**

The event loop is a mechanism in Node.js that allows it to handle multiple
requests and operations simultaneously. It continuously checks for new
events or tasks in the queue and executes them one by one. This ensures that
Node.js can handle a large number of requests without blocking the
main thread, making it highly efficient and scalable.

Javascipt is an interpreted language it executes code from top
to down. In JavaScript we have something called callstack,callback
and web apis. So when code execution starts it adds everyting one
by one to the callstack and whenever it encounters any timeout,
fetch,interval functions which takes some times to complete it
it pull ot from the callstack and put into the webapi which is
going to wait for the task to finish .After the task is finished executing we
push it into the callback queue and event loop takes all the
taks from callback queue and pushes them to the callstack where
they are executed.

```js
NodeJS -> Inbuilt function util.promisify or use .promise
```

### Event Emitter

EventEmitter is a built-in module in Node.js that allows you to
create objects that can emit and listen for events.

```js
// get back the class
// if want custom extend from class
// otherwise just for emitting and handling events create instance
const EventEmitter = require('events');

const customEmitter = new EventEmitter();

// on and emit methods
// keep track of the order
// additional arguments
// built-in modules utilize it

customEmitter.on('response', (name, id) => {
    console.log(`data recieved user ${name} with id:${id}`);
});

customEmitter.on('response', () => {
    console.log('some other logic here');
});

customEmitter.emit('response', 'john', 34);
```

### Streams

> Extends emitter class

-   Read and write sequentially
-   Manipulate or read a big file

They allow you to read and write data in chunks,
rather than all at once, which can be more efficient
for large amounts of data.

> Types

-   Writeable
-   Readable
-   DUpleax
-   Transform

> Create a big file

```js
const { writeFileSync } = require('fs');
for (let i = 0; i < 10000; i++) {
    writeFileSync('./content/big.txt', `hello world ${i}\n`, { flag: 'a' });
}
```

> Stream example

```js
const { createReadStream } = require('fs');

// default chunk size -> 64kb
// highWaterMark - control size [Specify chunk size]
// Specify encoding to output in human readable
const stream = createReadStream('./content/big.txt', {
    encoding: 'utf8',
    highWaterMark: 9000
});

stream.on('data', (res) => {
    console.log(res);
});

stream.on('error', (err) => console.log(err));
```

> Stream HTTP

```js
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    // const text = fs.readFileSync('./content/big.txt', 'utf8')
    // res.end(text)
    const fileStream = fs.createReadStream('./content/big.txt', 'utf8');
    fileStream.on('open', () => {
        fileStream.pipe(res);
    });
    fileStream.on('error', (err) => {
        res.end(err);
    });
}).listen(5000);
```
