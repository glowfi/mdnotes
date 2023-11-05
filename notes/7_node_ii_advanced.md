# Node II

**Difference b/w res.end() vs res.send()**

| res.end()                                                                                                               | res.send()                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Used to end the response and send a body as response                                                                    | used to send a response body                                                                                    |
| Cannot set header and status code                                                                                       | Automatically sets content-type header based on the data passed as an argument                                  |
| Immediately terminates the connection with client                                                                       | Waits for the response to be send and then terminates the connection                                            |
| Cannot do this                                                                                                          | Sets Eh-tag header which is used for cache validation                                                           |
| Used to end the response stream and flush any remaining data to the client synchronously. It does not return a promise. | Used to send data to the client asynchronously. It returns a promise that resolves when the data has been sent. |

### Request

Contains:

-   **METHODS**
-   **URLS (endpoint/Resource to access)**
-   **Headers**
-   **Body(optional)**

### Response

Contains:

-   **Headers**
-   **Status code**
-   **Status message**
-   **Body(optional)**

### Reference

-   [Common HTTPCodes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

-   [Common Mimetypes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)

> What are headers in browser?

**Headers contain important information such as the type of browser being used,
the language preferences of the user, the type of content being requested,
and any cookies or authentication tokens that may be required.**

### Simple HTTP server

```js
const http = require('http');

const server = http.createServer((req, res) => {
    // Write header
    res.writeHead(200, { 'content-type': 'text/html' });

    // Write response body
    res.write('<h1>hello</h1>');

    // End connection after body and response have been sent to the client
    res.end();
});

server.listen(5000, () => {
    console.log('Started!');
});
```

### Reading HTML File

```js
const http = require('http');
const { readFileSync } = require('fs');

// Will be initialized only at server start and will not block
const somePage = readFileSync('path-to-html-file');

const server = http.createServer((req, res) => {
    console.log(req.url);
    // Write header
    res.writeHead(200, 'Doneman!', { 'content-type': 'text/html' });

    // Write response body
    res.write('<h1>hello</h1>');

    // End connection after body and response have been sent to the client
    res.end();
});

server.listen(5000, () => {
    console.log('Started!');
});
```

### Using without express

> We need to handle all thr routing by ourselves,handle the locations of the static assets like css,js in our server etc,mention headers by ourselves.

```js
const http = require('http');
const { readFileSync } = require('fs');

// get all files
const homePage = readFileSync('./navbar-app/index.html');
const homeStyles = readFileSync('./navbar-app/styles.css');
const homeImage = readFileSync('./navbar-app/logo.svg');
const homeLogic = readFileSync('./navbar-app/browser-app.js');

const server = http.createServer((req, res) => {
    // console.log(req.method)
    const url = req.url;
    console.log(url);
    // home page
    if (url === '/') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write(homePage);
        res.end();
    }
    // about page
    else if (url === '/about') {
        res.writeHead(200, { 'content-type': 'text/html' });
        res.write('<h1>about page</h1>');
        res.end();
    }
    // styles
    else if (url === '/styles.css') {
        res.writeHead(200, { 'content-type': 'text/css' });
        res.write(homeStyles);
        res.end();
    }
    // image/logo
    else if (url === '/logo.svg') {
        res.writeHead(200, { 'content-type': 'image/svg+xml' });
        res.write(homeImage);
        res.end();
    }
    // logic
    else if (url === '/browser-app.js') {
        res.writeHead(200, { 'content-type': 'text/javascript' });
        res.write(homeLogic);
        res.end();
    }
    // 404
    else {
        res.writeHead(404, { 'content-type': 'text/html' });
        res.write('<h1>page not found</h1>');
        res.end();
    }
});

server.listen(5000);
```

> Why use express js

-   **Provides us with many robust set of features**
-   **Handles routing**
-   **Provides us with many HTTP methods which we can use .**
-   **Provides us with middlewares.**

### Simple Express App

```js
const express = require('express');

const app = express();

// USE GET method
app.get('/', (req, res) => {
    res.status(200).send('<h1>hello</h1>');
});

// res.all() is a method that sets up a route to handle all HTTP methods (GET, POST, PUT, DELETE, etc.) for a given path.
app.all('*', (req, res) => {
    res.status(404).send('<h3>Not Found</h3>');
});

// Keep Listening for requests
app.listen(5000, () => {
    console.log('Listening .....');
});
```

### Static assests

-   **If we do SSR we do not need to mention the index.html if our public folder has index.html as express will Automatically serve that file.**
    **We can uncomment the lines path-to-index.**

-   **Note 1: For every `endpoints we must configure the corresponding methods allowed for it`
    For example: if there is a route `/api/gt/gtx` we must define what to expect when there is
    a get request,post request If there is `a get request we can display a html page` or if there
    is `a post request we can respond back with json data`.**

-   **Note 2: Just keep in mind that staic assests are accesible via base root.Suppose in the
    public folder we have folder css->fir.css.We can access it via \<domain\>/css/fir.css.
    Just give the correct relative path in the html files.**

```js
const express = require('express');
const path = require('path');

const app = express();

// Make static files available by using below middleware
app.use(express.static('path-to-public-folder'));

// USE GET method
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'path-to-index.html for this page'));
});

// res.all() is a method that sets up a route to handle all HTTP methods (GET, POST, PUT, DELETE, etc.) for a given path.
app.all('*', (req, res) => {
    res.status(404).send('<h3>Not Found</h3>');
});

// Keep Listening for requests
app.listen(5000, () => {
    console.log('Listening .....');
});
```

### Reading files and then sending

```js
const express = require('express');
const { readFileSync } = require('fs');

const data = readFileSync('./public/sec.html', 'utf8');
console.log(data);

const app = express();

app.use(express.static('./public'));
app.get('/', (req, res) => {
    res.send(data);
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

### API vs SSR difference

| API                       | SSR                            |
| ------------------------- | ------------------------------ |
| We send data through json | We send data through templates |
| We use res.json()         | We use res.render()            |

### Route Params

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>hello</h1>');
});

// Single Route parameter
app.get('/api/v1/:productID', (req, res) => {
    // Get the route parameter (Slug)
    // Will be an object -> {productID:3}
    console.log(req.params);

    return res.send('hello');
});

// Multiple Route parameters
app.get('/api/v1/:productID/review/:reviewID', (req, res) => {
    // Get the route parameter (Slug)
    // Will be an object -> {productID:3,reviewID:3}
    console.log(req.params);

    return res.send('hello');
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

### Query String

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>hello</h1>');
});

// Query String
app.get('/api/v1/query', (req, res) => {
    // on Putting-> http://localhost:5000/api/v1/query?name=hello&id=3
    // {name:"hello",id:3}
    console.log(req.query);

    return res.send('hello');
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

### Middlewares

> What are middlewares in nodejs

-   **function that sits between the client and server and performs some operations on the incoming request or outgoing response.**

-   **It can modify the request/response, add new properties to them, or perform some other tasks before passing them to the next middleware**

-   **Middleware is used to handle common tasks such as authentication,**
    **logging, error handling, and more.**

-   **handles a specific task or set of tasks during the**
    **request-response cycle of an HTTP server**

> Middleware basics

```js
const express = require('express');

const app = express();

// Express will pass the req,res,next to this middleware function automatically
const logger = (req, res, next) => {
    // Appending a useful value to request object
    req.user = 'johndoe';

    // Pass the control to the next middlewares
    next();
};

app.get('/', logger, (req, res) => {
    // Printing what middleware appended
    console.log(req.user);
    res.send('<h1>hello</h1>');
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

> Multi Middleware

```js
const express = require('express');

const app = express();

// Express will pass the req,res,next to this middleware function automatically
const logger = (req, res, next) => {
    console.log('Logger1');

    // Pass the control to the next middlewares
    next();
};

const logger2 = (req, res, next) => {
    console.log('Logger2');

    // Pass the control to the next middlewares
    next();
};

// Array is used for multi middlewares
app.get('/', [logger, logger2], (req, res) => {
    res.send('<h1>hello</h1>');
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

> All Routes Middleware

```js
const express = require('express');

const app = express();

const logger = (req, res, next) => {
    console.log(req.url);
    next();
};

// Will be used by all routes
app.use(logger);

app.get('/', (req, res) => {
    res.send('<h1>hello</h1>');
});

app.get('/api/hello', (req, res) => {
    res.send('<h1>hello</h1>');
});

app.get('/api/hello/world', (req, res) => {
    res.send('<h1>hello</h1>');
});

app.all('*', (req, res) => {
    res.send('<h1>not found!</h1>');
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

> Route specific Middleware

```js
const express = require('express');

const app = express();

const logger = (req, res, next) => {
    console.log(req.url);
    next();
};

// Will be used by all routes starting with "/api"
app.use('/api', logger);

app.get('/', (req, res) => {
    res.send('<h1>hello</h1>');
});

app.get('/xyz', (req, res) => {
    res.send('<h1>hello</h1>');
});

// logger will be used here
app.get('/api/hello', (req, res) => {
    res.send('<h1>hello</h1>');
});

// logger will be used here
app.get('/api/hello/world', (req, res) => {
    res.send('<h1>hello</h1>');
});

app.all('*', (req, res) => {
    res.send('<h1>not found!</h1>');
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

### HTTP Methods

```js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>hello</h1>');
});

// parse json [Javascript/Postman type submitted data]
app.use(express.json());

// Post request specific
app.post('/api/people', (req, res) => {
    // Will print the json send from Postman type app
    console.log(req.body);
    res.status(201).json(req.body);
});

app.listen(5000, (req, res) => {
    console.log('Started ....');
});
```

**Note : Try using a MVC (Model View Controller to structure node projects)**

### Express router

**Note: Create a folder named routes**

> router-people.js

```js
const express = require('express');
const router = express.Router();

const {
    getPeople,
    createPerson,
    createPersonPostman,
    updatePerson,
    deletePerson
} = require('../controllers/people');

router.get('/', getPeople);
router.post('/', createPerson);
router.post('/postman', createPersonPostman);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

router.route('/').get(getPeople).post(createPerson);
router.route('/postman').post(createPersonPostman);
router.route('/:id').put(updatePerson).delete(deletePerson);

module.exports = router;
```

> app.js

```js
const express = require('express');
const app = express();

const people = require('./routes/people');
const auth = require('./routes/auth');

// static assets
app.use(express.static('./methods-public'));
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.use('/api/people', people);
app.use('/login', auth);

app.listen(5000, () => {
    console.log('Server is listening on port 5000....');
});
```

### Express controllers

**Note: Create a folder named controllers**

```js
// No need to import anything

const createPerson = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res
            .status(400)
            .json({ success: false, msg: 'please provide name value' });
    }
    res.status(201).send({ success: true, person: name });
};

module.exports = {
    createPerson
};
```
