# A Basic App with nodejs+prisma

### Install express and prisma

```sh
npm i @prisma/client express dotenv nodemon
```

### Add to package.json

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
    posts Post[]
}

model Post{
    id Int @id @default(autoincrement())
    updatedAt DateTime @default(now())
    createdAt DateTime @updatedAt
    title String @db.VarChar(255)
    desc String @db.Text()
    author User @relation(fields: [authorId],references: [id])
    authorId Int
}
```

> Run migration

```sh
npx prisma migrate dev --name init
```

## Controllers

> controllers/posts.js

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res) => {
    const result = await prisma.post.create({
        data: req.body
    });
    res.json(result);
};

const updatePost = async (req, res) => {
    const result = await prisma.post.findFirst({
        where: { id: parseInt(req.params.id) }
    });

    if (result) {
        const result = await prisma.post.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        return res.json(result);
    }
    return res.json({ msg: 'No Such Record!' });
};

const deletePost = async (req, res) => {
    const result = await prisma.post.findFirst({
        where: { id: parseInt(req.params.id) }
    });
    if (result) {
        const result = await prisma.post.delete({
            where: { id: parseInt(req.params.id) }
        });
        return res.json(result);
    }
    return res.json({ msg: 'No Such Record!' });
};

const getAllPost = async (req, res) => {
    const result = await prisma.post.findMany();
    res.json(result);
};

const getPost = async (req, res) => {
    console.log(req.params.id);
    const result = await prisma.post.findMany({
        where: { id: parseInt(req.params.id) }
    });
    res.json(result);
};

module.exports = { createPost, updatePost, deletePost, getAllPost, getPost };
```

## Routes

> routes/posts.js

```js
const {
    getPost,
    getAllPost,
    createPost,
    updatePost,
    deletePost
} = require('../controllers/post');

const express = require('express');
const router = express.Router();

// Get all post
router.get('/', getAllPost);

// Get post by id [with path parameter]
router.get('/:id', getPost);

// Create post
router.post('/', createPost);

// Update post
router.put('/:id', updatePost);

// Delete post
router.delete('/:id', deletePost);

module.exports = router;
```

## App

> index.js

```js
const express = require('express');
const dotenv = require('dotenv');
const post = require('./routes/post');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/v1/post', post);

app.listen(5000, () => {
    console.log('hello');
});
```
