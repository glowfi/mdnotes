### Integrate TRPC with bun

#### Install

```sh
bun add dotenv @types/dotenv @types/express express @types/cookie-parser cookie-parser cors @types/cors zod @trpc/server
```

#### Basic Integration Server

> src/index.ts

```ts
import 'dotenv/config';

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { appRouter } from './trpc';

// Express initialize
const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true
    })
);

// TRPC Server
app.use('/trpc', createExpressMiddleware({ router: appRouter }));
app.listen(5000);
console.log('Express Server started!');
```

> src/trpc.ts

```ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
    sayHi: t.procedure.query(() => {
        return 'hi';
    }),
    logToserver: t.procedure
        .input((v) => {
            if (typeof v === 'string') return v;
            throw new Error('Invalid Input!');
        })
        .mutation((req) => {
            console.log(req.input);
            return true;
        })
});

export type AppRouter = typeof appRouter;
```

### Basic Integration client

#### Install

```sh
bun add @trpc/server@next @trpc/client@next @trpc/react-query@next @trpc/next@next @tanstack/react-query@latest zod
```

> lib/utils.ts

```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../../server/src/trpc';

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.BACKEND_URL as string,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: 'include'
                });
            }
        })
    ]
});

export const main = async () => {
    console.log('Entered!');
    // const res = await trpcClient.sayHi.query();
    const res = await trpc.logToserver.mutate('asd');
    console.log(res);
};
```

> app/page.tsx

```tsx
import { trpc } from '@/lib/utils';

const fn = async () => {
    let res = await trpc.sayHi.query();
    console.log(res);
};

const Page = async () => {
    await fn();
    return <div>Hello World!</div>;
};

export default Page;
```

### Nested Routes

> src/routers/index.ts

```ts
import { t } from '../trpc';
import { userRouter } from './user';

export const appRouter = t.router({
    sayHi: t.procedure.query(() => {
        return 'hi';
    }),
    logToserver: t.procedure
        .input((v) => {
            if (typeof v === 'string') return v;
            throw new Error('Invalid Input!');
        })
        .mutation((req) => {
            console.log(req.input);
            return true;
        }),
    user: userRouter
});

export type AppRouter = typeof appRouter;
```

> src/routers/user.ts

```ts
import { t } from '../trpc';
import { z } from 'zod';

export const userRouter = t.router({
    inputUser: t.procedure
        .input(z.object({ name: z.string() }))
        // .input((inp) => inp)
        .query((req) => {
            console.log(req.input);
            return 'hello';
        })
});
```

> src/trpc.ts

```ts
import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();
```

#### Final Client (client+server side)

```ts
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter, ccf } from '../../../server/src/routers/index';

// client side
export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.BACKEND_URL as string,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: 'include'
                });
            }
        })
    ]
});

// server client side
export const serverClient = ccf({
    // @ts-ignore
    links: [
        httpBatchLink({
            url: process.env.BACKEND_URL as string,
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: 'include'
                });
            }
        })
    ]
});

export const main = async () => {
    console.log('Entered!');
    const res = await serverClient.user.inputUser({
        id: 123213,
        name: 'hello'
    });

    console.log(res, 'Result');
};
```

### Context

> src/create-context.ts

```ts
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createContext = ({ req, res }: CreateExpressContextOptions) => {
    return {
        isAdmin: true,
        req,
        res
    };
};
```

> src/index.ts

```ts
import { initTRPC, type inferAsyncReturnType } from '@trpc/server';
import type { createContext } from './create-context';

export const t = initTRPC
    .context<inferAsyncReturnType<typeof createContext>>()
    .create({
        allowOutsideOfServer: true
    });

export const { createCallerFactory, router } = t;
```

#### Middlewares

```ts
import { initTRPC, type inferAsyncReturnType, TRPCError } from '@trpc/server';
import type { createContext } from './create-context';

export const t = initTRPC
    .context<inferAsyncReturnType<typeof createContext>>()
    .create({
        allowOutsideOfServer: true
    });

export const { createCallerFactory, router } = t;

export const isAdminMiddleware = t.middleware(({ ctx, next }) => {
    if (!ctx.isAdmin) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { user: { id: 1 } } });
});

export const adminProcedure = t.procedure.use(isAdminMiddleware);
```
