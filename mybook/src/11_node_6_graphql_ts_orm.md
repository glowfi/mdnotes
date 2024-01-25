# NodeJS + Apollo GraphQL + Typescript + PostgresSQL

### Install Dependencies

```sh
npm init -y
npm i typescript @types/node --save-dev
npm i @apollo/server graphql dotenv @types/dotenv
npm i nodemailer @types/nodemailer
touch tsconfig.json
npx prisma init
```

** Add the following to below files : **

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

> package.json

```json
"type": "module",
"scripts": {
    "build": "tsc",
    "start": "tsc --watch & node --watch dist/index.js"
},
```

> prisma/schema.prisma

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User{
    id Int @id @default(autoincrement())
    name String
    email String
    password String
    posts Post[]
}

model Post{
    id Int @id @default(autoincrement())
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    title String
    desc String
    author User @relation(fields: [authorid], references:[id])
    authorid Int
}
```

> Run migrations

```sh
npx prisma migrate dev --name init
```

### Main App

> src/index.ts

```ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { config } from 'dotenv';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

config();

const run = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        listen: {
            port: 4000
        }
    });
    return url;
};

run()
    .then((url) => {
        console.log(`Started Server at ${url}`);
    })
    .catch((err) => {
        console.log(err);
    });
```

> src/schema.ts

```ts
export const typeDefs = `#graphql
    type User{
        id:ID
        name:String
        email:String
    }

    type Post{
        id:ID
        createdAt : String
        updatedAt : String
        title: String
        desc: String
        authorid:ID

    }

    type Query{
        getalluser:[User]
        getuserbyid(id:ID):User
        getallposts:[Post]
        getpostbyauthor(id:ID):[Post]
        getpostbyid(id:ID):Post
    }

    type resp  {
        err:Error
        user:User
    }

    type Error{
        msg:String!
    }

    input registerinfo{
        name:String!
        email:String!
        password:String!
    }

    input logininfo{
        email:String!
        password:String!
    }

    input createpostinfo{
        authorid:ID!
        title:String!
        desc:String!
    }

    input updatepostinfo{
        postid:ID!
        title:String
        desc:String
    }

    input resetpass{
        id:ID!
        email:String!
        password:String!
    }


    type Mutation{
        register(userinfo:registerinfo):resp
        login(logininfo:logininfo):resp
        createpost(info:createpostinfo):Post
        updatepost(upinfo:updatepostinfo):Post
        deletepost(id:ID):Post
        sendforgetpassmail(email:String!):Boolean
        resetpassword(info:resetpass):resp
    }

`;
```

> src/resolvers.ts

```ts
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export const resolvers = {
    Query: {
        getalluser: async () => {
            const data = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });
            return data;
        },
        getuserbyid: async (_, { id }) => {
            const data = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                where: {
                    id: parseInt(id)
                }
            });
            return data;
        },
        getallposts: async () => {
            const data = await prisma.post.findMany({
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    title: true,
                    desc: true,
                    authorid: true
                }
            });
            return data;
        },
        getpostbyauthor: async (_, { id }) => {
            const data = await prisma.post.findMany({
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    title: true,
                    desc: true,
                    authorid: true
                },
                where: {
                    authorid: parseInt(id)
                }
            });
            return data;
        },
        getpostbyid: async (_, { id }) => {
            const data = await prisma.post.findFirst({
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    title: true,
                    desc: true,
                    authorid: true
                },

                where: { id: parseInt(id) }
            });
            return data;
        }
    },
    Mutation: {
        register: async (_, { userinfo: { name, email, password } }) => {
            // Check user exist
            const finduser = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                where: { email: email }
            });
            if (finduser) {
                return {
                    user: null,
                    err: {
                        msg: 'Email exists! Please use a different email address!'
                    }
                };
            } else {
                const user = await prisma.user.create({
                    data: {
                        email,
                        name,
                        password
                    }
                });
                return {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                    err: null
                };
            }
        },
        login: async (_, { logininfo: { email, password } }) => {
            // Check user exist
            const finduser = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    email: true
                },
                where: { email: email, password: password }
            });
            if (!finduser) {
                return {
                    user: null,
                    err: {
                        msg: 'Please enter correct email and password!'
                    }
                };
            } else {
                return {
                    user: {
                        id: finduser.id,
                        name: finduser.name,
                        email: finduser.email
                    },
                    err: null
                };
            }
        },
        createpost: async (_, { info: { authorid, title, desc } }) => {
            const createpost = await prisma.post.create({
                data: {
                    title,
                    desc,
                    authorid: parseInt(authorid)
                }
            });
            return {
                id: createpost.id,
                createdAt: createpost.createdAt,
                updatedAt: createpost.updatedAt,
                title: createpost.title,
                desc: createpost.desc,
                authorid: createpost.authorid
            };
        },
        updatepost: async (_, { upinfo: { postid, title, desc } }) => {
            const updatepost = await prisma.post.update({
                where: {
                    id: parseInt(postid)
                },
                data: {
                    title,
                    desc
                }
            });

            return {
                id: updatepost.id,
                createdAt: updatepost.createdAt,
                updatedAt: updatepost.updatedAt,
                title: updatepost.title,
                desc: updatepost.desc,
                authorid: updatepost.authorid
            };
        },
        deletepost: async (_, { id }) => {
            const updatepost = await prisma.post.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return {
                id: updatepost.id,
                createdAt: updatepost.createdAt,
                updatedAt: updatepost.updatedAt,
                title: updatepost.title,
                desc: updatepost.desc,
                authorid: updatepost.authorid
            };
        },
        sendforgetpassmail: async (_, { email }) => {
            // Only needed if you don't have a real mail account for testing
            // let testAccount = await nodemailer.createTestAccount();
            // console.log(testAccount);

            // Future -> Check if user exists and then only send mail

            let user = 'q3oqwlgga4verudl@ethereal.email';
            let pass = 'RHXPUjDXYjnAGsG98e';

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: user, // generated ethereal user
                    pass: pass // generated ethereal password
                }
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: `${user}`, // sender address
                to: 'bar@example.com, baz@example.com', // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>Hello world?</b>', // html body
                attachments: [
                    {
                        filename: 'hello.json',
                        content: JSON.stringify({
                            name: 'Hello World!'
                        })
                    }
                ]
            });
            console.log('Message sent: %s', info.messageId);

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            return true;
        },
        resetpassword: async (_, { info: { email, password, id } }) => {
            const finduser = await prisma.user.update({
                where: {
                    email,
                    id: parseInt(id)
                },
                data: {
                    password
                }
            });
            return {
                user: {
                    id: finduser.id,
                    name: finduser.name,
                    email: finduser.email
                },
                err: null
            };
        }
    }
};
```
