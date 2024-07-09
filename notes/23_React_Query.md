### React Query

```sh
npm create vite@latest myapp
npm i @tanstack/react-query @tanstack/react-query-devtools
cd myapp
```

#### Global client wrapper

> react-query-wrapper.tsx

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 10 * (60 * 1000)
        }
    }
});

export const ReactQueryWrapper = ({ children }: React.PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
```

#### Post List 1

```tsx
import { useQuery } from '@tanstack/react-query';

async function getPosts() {
    const data = await fetch('http://localhost:5000/posts');
    const res = await data.json();
    console.log(res);
    return res.data;
}

export default function PostsList1() {
    const postsQuery = useQuery({
        queryKey: ['posts'],
        queryFn: async () => await getPosts(),
        placeholderData: [{ id: 1, title: 'Initial Data' }]
    });

    if (postsQuery.status === 'pending') return <h1>Loading...</h1>;
    if (postsQuery.status === 'error') {
        return <h1>{JSON.stringify(postsQuery.error)}</h1>;
    }

    return (
        <div>
            <h1>Posts List 1</h1>
            <ol>
                {postsQuery.data.map((post: any) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ol>
        </div>
    );
}
```

#### Post by id

```tsx
import { useQuery } from '@tanstack/react-query';
import { getPost } from './api/posts';
import { getUser } from './api/users';

export default function Post({ id }) {
    const postQuery = useQuery({
        queryKey: ['posts', id],
        queryFn: () => getPost(id)
    });

    const userQuery = useQuery({
        queryKey: ['users', postQuery?.data?.userId],
        // Only do after this
        enabled: postQuery?.data?.userId != null,
        queryFn: () => getUser(postQuery.data.userId)
    });

    if (postQuery.status === 'loading') return <h1>Loading...</h1>;
    if (postQuery.status === 'error') {
        return <h1>{JSON.stringify(postQuery.error)}</h1>;
    }

    return (
        <>
            <h1>
                {postQuery.data.title} <br />
                <small>
                    {userQuery.isLoading
                        ? 'Loading User...'
                        : userQuery.isError
                          ? 'Error Loading User'
                          : userQuery.data.name}
                </small>
            </h1>
            <p>{postQuery.data.body}</p>
        </>
    );
}
```

#### Create Post

```tsx
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { queryClient } from './react-query-wrapper';

async function createPost(data: any) {
    console.log(data);
    const res = await fetch('http://localhost:5000/posts', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const _res = await res.json();
    console.log(_res);
    return _res;
}

const CreatePost = ({ setCurrentPage }: any) => {
    const createPostQuery = useMutation({
        mutationFn: async (data) => {
            return await createPost(data);
        },
        onSuccess: (data) => {
            // update cache for post by id to skip loading
            queryClient.setQueryData(['posts', data.id], data);

            // invalidate
            queryClient.invalidateQueries({ queryKey: ['posts'], exact: true });
        }
    });

    const title = useRef();
    const body = useRef();

    return (
        <>
            <h3>CreatePost </h3>
            <input type="text" ref={title} />
            <input type="text" ref={body} />
            <button
                type="button"
                onClick={() => {
                    createPostQuery.mutateAsync({
                        title: title.current.value,
                        body: body.current.value
                    });
                }}
            >
                Add
            </button>
        </>
    );
};

export default CreatePost;
```

#### App.tsx

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import PostsList1 from './PostList1';
import CreatePost from './CreatePost';

export default function App() {
    const [currentPage, setCurrentPage] = useState(<PostsList1 />);
    const queryClient = useQueryClient();

    return (
        <div>
            <button onClick={() => setCurrentPage(<PostsList1 />)}>
                Posts List 1
            </button>
            <button
                onClick={() =>
                    setCurrentPage(
                        <CreatePost setCurrentPage={setCurrentPage} />
                    )
                }
            >
                New Post
            </button>
            <br />
            {currentPage}
        </div>
    );
}
```

#### Fastapi backend

```sh
python -m venv env
source ./env/bin/activate.fish
pip install fastapi uvicorn
wget "https://raw.githubusercontent.com/WebDevSimplified/react-query-crash-course-example/main/api/db.json"
```

```py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import time
from pydantic import BaseModel
from starlette.responses import JSONResponse
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = None
with open("./db.json", "r") as fp:
    db = json.load(fp)


def add_post_to_json(data):
    if db:
        val = {
            "userId": 1,
            "id": int(time.time()),
            "title": data.title,
            "body": data.body,
        }

        db["posts"].append(val)
        with open("./db.json", "w") as fp:
            json.dump(db, fp, indent=4)

        return val
    return None


@app.get("/posts")
async def get_posts():
    return JSONResponse(content={"data": db["posts"] if db else None})


@app.get("/posts/id")
async def get_posts_by_id(id: int):
    return JSONResponse(content={"data": db["posts"][id] if db else None})


class Data(BaseModel):
    title: str
    body: str


@app.post("/posts")
async def create_post(data: Data):
    val = add_post_to_json(data)
    return JSONResponse(content=val)


if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, reload=True)
```
