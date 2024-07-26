### Monorepo setup

```sh
mkdir monorepo
cd monorepo
bun init -y
mkdir apps libs
rm -rf index.ts

cd apps
mkdir web
cd web
bunx create-next-app@latest .
cd ../..

cd apps
mkdir server
cd server
bun init -y
bun add express cors dotenv
bun add -D @types/express @types/cors
cd ../..

### Add these to package.json [server]
  "workspaces": [
    "apps/*",
    "libs/*"
  ]



    "private": true,

    "scripts": {
        "format": "prettier  '{apps,libs}/**/*.{ts,tsx,js,json}' --ignore-path .gitignore",
        "format:check": "bun format --check",
        "format:write": "bun format --write",
        "build": "bun nx run-many -t build",
        "lint": "bun nx run-many -t lint",
        "validate": "bun run format:write && bun run lint && bun run build && cd libs/db/;bun run prisma generate",
        "prepare": "husky"
    },

```

### Server Code

> src/index.ts

```ts
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
    return res.json({ msg: 'Hello World!' }).status(200);
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on http://localhost:${process.env.SERVER_PORT} ...`);
});
```

### Web Code

Delete the template nextjs code and start server and check

### Validation Code

### Install nx to root

```sh
### Add these to root package.json
bunx nx@latest init

dev, build [order]
build, lint [cache]
next,dist,build [output]

bun nx run-many -t build
```

### Add prettier to root

```sh

### Install

bun add -D prettier

### package.json
    "scripts": {
        "format": "prettier  '{apps,libs}/**/*.{ts,tsx,js,json}' --ignore-path .gitignore",
        "format:check": "bun format --check",
        "format:write": "bun format --write",
        "build": "bun nx run-many -t build",
        "lint": "bun nx run-many -t lint"
    },
```

### Add Husky & lint-staged

```sh
bunx husky init;
bun add --dev husky;
bun install

### Add to pre-commit
bun run lint-staged


bun add -D lint-staged
touch .lintstagedrc
echo "{
'{apps,libs}/**/*.{ts,tsx,js,json}':'bun run validate',
}" > .lintstagedrc
```

### Add prisma

```sh
# change name package.json

bun add -D prisma
bun add @prisma/client
bunx prisma init --datasource-provider postgresql

bunx prisma generate
bunx prisma migrate dev --name "Initial Migration"

ALTER DATABASE template1 REFRESH COLLATION VERSION;
```

```env
DATABASE_URL="postgresql://postgres:@localhost:5432/authdb?schema=public"
```

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model User {
    uid          String        @id
    createdAt    DateTime      @default(now())
    updatedAt    DateTime      @updatedAt
    name         String?
    image        String?
    Credentials  Credentials?
    AuthProvider AuthProvider?
    Admin        Admin?
    Manager      Manager?
}

model Admin {
    uid  String @id
    user User   @relation(fields: [uid], references: [uid])
}

model Manager {
    uid  String @id
    user User   @relation(fields: [uid], references: [uid])
}

model Credentials {
    uid          String   @id
    email        String   @unique
    user         User     @relation(fields: [uid], references: [uid])
    passwordHash String
    createdAt    DateTime @default(now())
    updatedAt    DateTime @updatedAt
}

model AuthProvider {
    uid String @id
    type AuthProviderType
    user User             @relation(fields: [uid], references: [uid])
}

enum AuthProviderType {
    GOOGLE
    CREDENTIALS
}
```

> libs/db/index.ts

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error']
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

> libs/db/types.ts

```ts
export * from '@prisma/client';
```

### TRPC Setup

```sh

# change name package.json


cd libs
mkdir trpc-server trpc-client
cd trpc-server
bun add @trpc/server
cd ../..
"@monorepo/db": "workspace:^"
```

> libs/trpc-server/index.ts

```ts
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';

export const trpcExpress = createExpressMiddleware({
    router: appRouter
});
```

> libs/trpc-server/trpc.ts

```ts
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

> libs/trpc-server/routers/index.ts

```ts
import type { inferRouterOutputs } from '@trpc/server';
import { router } from '../trpc';
import { authRoutes } from './auth';

export const appRouter = router({
    auth: authRoutes
});

export type AppRouter = typeof appRouter;
export type AppRouterType = inferRouterOutputs<AppRouter>;
```

> libs/trpc-server/routers/auth.ts

```ts
import { publicProcedure, router } from '../trpc';
import { prisma } from '@monorepo/db';

export const authRoutes = router({
    users: publicProcedure.query(() => {
        return prisma.user.findMany({});
    })
});
```

Add ExpressMiddleware

```ts
// TRPC Middleware
app.use('/trpc', trpcExpress);

// Add dependencies
"dependencies": {
        "@monorepo/trpc-server": "workspace:^"
    },
```

### TRPC in react client & server

```sh
bun add @tanstack/react-query@4.36.1 @trpc/client @trpc/react-query react
bun add dotenv
bun add -D @types/dotenv
```

> src/libs/trcp-client/src/client.ts

```ts
import type { AppRouter } from '@monorepo/trpc-server/routers';
import { createTRPCReact } from '@trpc/react-query';

export const trpcClient = createTRPCReact<AppRouter>();
```

> src/libs/trcp-client/src/index.ts

```ts
import type { AppRouter } from '@monorepo/trpc-server/routers';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import 'dotenv/config';

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: process.env.SERVER_URL as string
        })
    ]
});
```

> src/libs/trcp-client/src/Provider.tsx

```tsx
'use client';

import { trpcClient as trpc } from './client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

import React, { useState } from 'react';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: process.env.SERVER_URL as string
                })
            ]
        })
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </trpc.Provider>
    );
};
```

### Add to web

```sh
"dependencies": {
        "@monorepo/trpc-client": "workspace:^"
    },
<Provider>{children}</Provider>

env: {
        SERVER_URL: process.env.SERVER_URL
    }
```

### AuthN and AuthZ

Add context

> libs/trpc-server/context.ts

```ts
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export const createTRPCContext = ({
    req,
    res
}: CreateExpressContextOptions) => {
    const header = req.headers.authorization;
    const token = header?.split(' ')[1];
    return { req, res, token };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
```

> libs/trpc-server/index.ts

```ts
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createTRPCContext } from './context';

export const trpcExpress = createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext
});
```

> libs/trpc-server/trpc.ts

```ts
import { initTRPC } from '@trpc/server';
import type { TRPCContext } from './context';

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

Add Middleware

```sh
bun add jsonwebtoken
bun add -D @types/jsonwebtoken
```

> libs/trpc-server/middleware.ts

```ts
import { TRPCError } from '@trpc/server';
import { verify, type JwtPayload } from 'jsonwebtoken';
import { t } from './trpc';
import type { Role } from './types';
import { authorizeUser } from './utils';

export const isAuthed = (...roles: Role[]) =>
    t.middleware(async (opts) => {
        const { token } = opts.ctx;
        if (!token) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Token not found.'
            });
        }

        let uid;

        try {
            const user = verify(token, process.env.NEXTAUTH_SECRET || '');
            uid = (user as JwtPayload).uid;
        } catch (error) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Invalid token.'
            });
        }

        await authorizeUser(uid, roles);

        return opts.next({ ...opts, ctx: { ...opts.ctx, uid } });
    });
```

> libs/trpc-server/utils.ts

```ts
import { prisma } from '@monorepo/db';
import { TRPCError } from '@trpc/server';
import type { Role } from './types';

export const getUserRoles = async (uid: string): Promise<Role[]> => {
    const [adminExists, managerExists] = await Promise.all([
        prisma.admin.findUnique({ where: { uid } }),
        prisma.manager.findUnique({ where: { uid } })
    ]);

    const roles: Role[] = [];
    if (adminExists) roles.push('admin');
    if (managerExists) roles.push('manager');

    return roles;
};

export const authorizeUser = async (
    uid: string,
    roles: Role[]
): Promise<void> => {
    if (!roles || roles.length === 0) {
        return; // No specific roles required, access is granted
    }

    const userRoles = await getUserRoles(uid);

    if (!userRoles.some((role) => roles.includes(role))) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'User does not have the required role(s).'
        });
    }
};

export const checkRowLevelPermission = async (
    uid: string,
    allowedUids: string | string[],
    allowedRoles: Role[] = ['admin']
) => {
    const userRoles = await getUserRoles(uid);

    if (userRoles?.some((role) => allowedRoles.includes(role))) {
        return true;
    }

    const uids =
        typeof allowedUids === 'string'
            ? [allowedUids]
            : allowedUids.filter(Boolean);

    if (!uids.includes(uid)) {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not allowed to do this action.'
        });
    }
};
```

> libs/trpc-server/types.ts

```ts
export type Role = 'admin' | 'manager';
```

> trpc.ts

```ts
import { initTRPC } from '@trpc/server';
import type { TRPCContext } from './context';
import { isAuthed } from './middleware';
import type { Role } from './types';

export const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
// export const privateProcedure = t.procedure.use(isAuthed());
export const privateProcedure = (...roles: Role[]) =>
    t.procedure.use(isAuthed(...roles));
```

Test by passing headers
