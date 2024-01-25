# GraphQL Basics with Apolloserver and nodeJS

### Install Dependencies

```sh
npm i @apollo/server graphql nodemon
```

### Add to package.json

```json
"scripts": {
    "dev": "nodemon index.js"
},
```

### Basic Apolloserver with hello query

```js
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Type Definations
const typeDefs = `#graphql
    type Query{
    hello:String!
    }
`;

// Function to call for queries and mutations
const resolvers = {
    Query: {
        hello: () => 'hello'
    }
};

// Start Apollo Server
const run = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
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

### Basics of queries and mutations

```js
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Type Definations [Schema]
const typeDefs = `#graphql

    # Normal Types
    type Errors{
    msg:String!
    code:Int!
    }

    type RegisterResponse{
    email:String
    password:String
    errors:[Errors]
    }

    type User{
    email:String
    password:String
    }

    # Input Type
    input UserInfo{
    email:String
    password:String
    }

    # Query Type [Used for quering,filtering,fetching]
    type Query{
    hello:String!
    getall:[User]
    }

    # Mutation type [Used for updating,creating,deleting]
    type Mutation{
    # Normal Way of taking input/arguments
    # register(email:String!,password:String!):RegisterResponse

    # Taking input/arguments using objects
    register(userinfo:UserInfo):RegisterResponse
    }

`;

// Function to call for queries and mutations
const resolvers = {
    Query: {
        hello: () => 'hello',
        getall: () => {
            return [{ email: 'asd', password: 'dsa' }];
        }
    },
    Mutation: {
        register: () => {
            return {
                email: 'xyz',
                password: 'xuz',
                errors: [{ msg: 'hello', code: 201 }]
            };
        }
    }
};

// Start Apollo Server
const run = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 }
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

### Resolver arguments

> In Apollo GraphQL each resolver has access to 4 args which are as follows:

-   parent : Parent object value of the prevois resolver.
-   args : Arguments passed to this resolver
-   context : A global value accesible to all resolvers.A custom object each resolver can read from/write to.
-   info : Parsed GraphQL query , mutation , subscription string [AST of the incoming request]

```js
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Type Definations [Schema]
const typeDefs = `#graphql

    # Normal Types
    type Errors{
    msg:String!
    code:Int!
    }

    type RegisterResponse{
    email:String
    password:String
    errors:[Errors]
    }

    type User{
    email:String
    password:String
    }

    # Input Type
    input UserInfo{
    email:String
    password:String
    }

    # Query Type [Used for quering,filtering,fetching]
    type Query{
    hello:String!
    getall:[User]
    }

    # Mutation type [Used for updating,creating,deleting]
    type Mutation{
    # Normal Way of taking input/arguments
    # register(email:String!,password:String!):RegisterResponse

    # Taking input/arguments using objects
    register(userinfo:UserInfo):RegisterResponse
    }

`;

// Function to call for queries and mutations
const resolvers = {
    User: {
        // We can have resolver for email too i.e. what to do when we see email [PARENT]
        email: (parent) => {
            console.log(parent);
            return parent.email.toUpperCase();
        }
    },
    Query: {
        hello: () => 'hello',
        getall: () => {
            return [{ email: 'asd', password: 'dsa' }];
        }
    },
    Mutation: {
        // Resolvers fn can be async
        register: async (parent, args, ctx, info) => {
            console.log(info); // [info]
            console.log(args); // [args]
            return {
                email: 'xyz',
                password: 'xuz',
                errors: [{ msg: 'hello', code: 201 }]
            };
        }
    }
};

// Start Apollo Server
const run = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        // Passing context [CONTEXT]
        context: async ({ req, res }) => {
            return { name: 'asd', id: '1' };
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
