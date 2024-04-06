### Backend

```sh
mkdir jwt-backend
cd jwt-backend
npm init -y
npm install express bcrypt jsonwebtoken cors nodemon cookie-parser
npm i @prisma/client express dotenv nodemon
npm install express-validator
```

> Add Script

```json
"scripts": {
    "dev": "nodemon index.js"
},
```

### Initialize Prisma project

```sh
npx prisma init
```

### ENV Variables

```
DATABASE_URL="postgresql://postgres:@localhost:5432/postdb?schema=public"
CHECKPOINT_DISABLE=1
```

> Documentation Links

-   [cli Reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)

-   [client Reference](https://www.prisma.io/docs/orm/reference/prisma-client-reference)

## Model/Schema

> prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User{
    id Int @id @default(autoincrement())
    email String
    password String
}

```

> Run migration

```sh
npx prisma migrate dev --name init
```

> Code

```js
// Imports
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// Constants
const PORT = 3333;
const secret = 'your-secret-key';

// Middlewares

// Verify Token
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// Custom Middleware
const logger = (req, res, next) => {
    console.log(req.url);
    next();
};

// Validator
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        let msg =
            errors.errors[0]['path'] == 'email'
                ? 'Invalid email address. Please try again.'
                : 'Password must be longer than 6 characters.';

        res.status(400).json({ data: null, errs: msg });
    };
};

// Use CORS middleware
app.use(
    cors({
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    })
);
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());
// custom logger
app.use(logger);
// Cookie
app.use(cookieParser());

// Routes
app.post('/', (req, res) => {
    return res.status(201).json({ name: 'hello' });
});

// User registration
app.post(
    '/register',
    validate([body('email').isEmail(), body('password').isLength({ min: 6 })]),
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.create({
                data: { email, password: hashedPassword }
            });
            return res.status(201).json({
                data: { email, password: hashedPassword },
                errs: null
            });
        } catch (err) {
            return res.status(500).json({ data: null, errs: err });
        }
    }
);

// User login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email!' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password!' });
        }
        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: '1h'
        });
        const reftoken = jwt.sign({ userId: user.id }, secret, {
            expiresIn: '1h'
        });

        res.cookie('jwt', reftoken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ token: token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Protected route
app.get('/', verifyToken, async (req, res) => {
    let userID = parseInt(req.userId);
    const new_user = await prisma.user.findUnique({ where: { id: userID } });

    res.status(200).json({ me: new_user });
});

// App Listening
app.listen(PORT, () => {
    console.log('Listening ....');
});
```

### Frontend

```sh
mkdir jwt-frontend
cd jwt-frontend
npm init -y
```

> Code

```js
import React, { useEffect } from 'react';

const App = () => {
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('http://localhost:3333/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'sad@sad.com',
                    password: 'helloworld'
                })
            });

            const resp = await data.json();
            console.log(resp);
        };

        fetchData();
    }, []);
    return <div>App</div>;
};

export default App;
```
