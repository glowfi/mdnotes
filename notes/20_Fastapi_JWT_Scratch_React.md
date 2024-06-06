### Install Dependencies

```sh
pip install fastapi uvicorn gunicorn pyjwt
```

> main.py

```py
from fastapi import Depends, FastAPI, Response, status
import datetime

from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from middlewares.authenticate import authenticate
from helper.utils import jwt_encode
from fastapi.middleware.cors import CORSMiddleware


# Main app
app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Generate JWT Token
@app.get("/login", status_code=200)
async def login(res: Response):
    user = {"id": 1, "name": "John"}
    accToken = await jwt_encode(
        user, int(datetime.datetime.timestamp(datetime.datetime.now())) + (60 * 60)
    )
    refToken = await jwt_encode(
        user,
        int(datetime.datetime.timestamp(datetime.datetime.now())) + (24 * 60 * 60),
    )

    res.set_cookie("refreshToken", refToken, httponly=True, samesite="strict")
    res.headers["Authorization"] = accToken

    return {"accToken": accToken, "id": 1, "user": "John"}


@app.get("/me")
async def me(data: dict = Depends(authenticate)):
    return data
```

> helper/utils.py

```py

import jwt


async def jwt_encode(data, exp):
    return jwt.encode(
        {**data, "exp": exp},
        "secret",
        algorithm="HS256",
    ).decode("utf-8")


async def jwt_decode(encoded_jwt):
    return jwt.decode(encoded_jwt, "secret", algorithms=["HS256"])
```

> middlewares/authenticate.py

```py
import sys

sys.path.append("..")


from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import Request, Response, status
import datetime
from helper import utils


async def authenticate(req: Request, res: Response):
    accToken, refToken = req.headers.get("Authorization", None), req.cookies.get(
        "refreshToken", None
    )

    # Check if both tokens provided
    if not accToken and not refToken:
        return JSONResponse(
            content=jsonable_encoder({"type": "err", "msg": "No Tokens provided"}),
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    decoded = {}

    # If acc_token not expired
    try:
        # Decode the jwt token
        decoded = await utils.jwt_decode(accToken)
        req.state.data = decoded.get("name")
        return JSONResponse(
            content=jsonable_encoder(
                {"type": "data", "msg": "Got user back!", "data": decoded.get("name")}
            ),
            status_code=status.HTTP_200_OK,
        )

    # If acc_token expired then use refToken to Generate new accToken
    except Exception as e:
        # Check Refresh token provided
        if not refToken:
            return JSONResponse(
                content=jsonable_encoder(
                    {"type": "err", "msg": "No Refresh Token provided"}
                ),
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

        # If ref_token not expired
        decoded = {}
        try:
            decoded = await utils.jwt_decode(refToken)
            accToken = await utils.jwt_encode(
                {"id": decoded.get("id"), "name": decoded.get("name")},
                int(datetime.datetime.timestamp(datetime.datetime.now())) + 15,
            )
            res.set_cookie("refreshToken", refToken, httponly=True, samesite="strict")
            res.headers["Authorization"] = accToken
            return JSONResponse(
                content=jsonable_encoder(
                    {
                        "type": "data",
                        "msg": "Refreshed Token",
                        "data": {
                            "accToken": accToken,
                            "id": decoded.get("id"),
                            "name": decoded.get("name"),
                        },
                    }
                ),
                status_code=status.HTTP_200_OK,
            )
        # If ref_token expired
        except Exception as e:
            return JSONResponse(
                content=jsonable_encoder(
                    {"type": "err", "msg": "refreshToken expired"}
                ),
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
```

> gunicorn.conf.py

```py

import os
import signal


def worker_int(worker):
    os.kill(worker.pid, signal.SIGINT)
```

> run.sh

```sh
#!/usr/bin/env bash

WORKERS=6
PORT=5000

gunicorn main:app -w "${WORKERS}" -b 0.0.0.0:"${PORT}" -k uvicorn.workers.UvicornWorker --log-file=- --log-level DEBUG --reload
```

> App.tsx

```ts
import { useCallback } from 'react';

const App = () => {
    const handleLogin = useCallback(async () => {
        const url = 'http://localhost:5000/login';
        const data = await fetch(url, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const final = await data.json();
        console.log('DATA', final);

        if (final['accToken']) {
            localStorage.setItem('accToken', final['accToken']);
        } else {
            console.log('No data found');
        }
    }, []);

    const me = useCallback(async () => {
        const url = 'http://localhost:5000/me';
        const data = await fetch(url, {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('accToken')
            }
        });
        const final = await data.json();
        if (final['accToken']) {
            localStorage.setItem('accToken', final['accToken']);
            console.log('DATA', final);
        } else {
            console.log(final);
        }
    }, []);

    return (
        <div>
            <button
                type="button"
                onClick={() => {
                    handleLogin();
                }}
            >
                Login
            </button>
            <button
                type="button"
                onClick={() => {
                    me();
                }}
            >
                Me
            </button>
        </div>
    );
};

export default App;
```
