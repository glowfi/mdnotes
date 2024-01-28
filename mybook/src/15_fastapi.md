# FastAPI

### Install dependencies

```sh
pip install fastapi uvicorn sqlalchemy strawberry-graphql[debug-server] asyncio python-dotenv asyncpg
```

## A simple crud app using sqlalchemy core,asyncpg,fastapi

.env

```
DB_URL=postgresql+asyncpg://postgres:@localhost/fastdb
```

> main.py

```py
import uvicorn
from fastapi import FastAPI
from sqlalchemy import delete, insert, select, update
from connectdb import engine
from tables import user_table, post_table
from schema import Post, PostBody, updateBody
from connectdb import engine


app = FastAPI()


@app.get("/post", response_model=list[Post])
async def get_all_posts():
    async with engine.connect() as conn:
        st = select(post_table)
        res = await conn.execute(st)
        data = res.scalars()
        return data


@app.get("/post/{id}", response_model=Post)
async def get_post_by_id(id: int):
    async with engine.connect() as conn:
        st = select(post_table).filter_by(id=id)
        res = await conn.execute(st)
        data = res.scalars()
        return data


@app.post("/post")
async def create_post(bd: PostBody):
    async with engine.connect() as conn:
        st = insert(post_table).values(
            title=bd.title, description=bd.description, author_id=bd.aid
        )
        await conn.execute(st)
        await conn.commit()
        return bd


@app.put("/post/{id}")
async def update_post(id: int, bd: updateBody):
    async with engine.connect() as conn:
        st = (
            update(post_table)
            .where(post_table.c.id == id)
            .values(title=bd.title, description=bd.description)
        )
        await conn.execute(st)
        await conn.commit()
        return bd


@app.delete("/post/{id}")
async def delete_post(id: int):
    async with engine.connect() as conn:
        st = delete(post_table).where(post_table.c.id == id)
        await conn.execute(st)
        await conn.commit()
    return {"msg": "Deleted!"}


@app.get("/")
async def hello():
    return {"msg": "hello_world"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, log_level="info", workers=4, port=5000)
```

> connectdb.py

```py
from sqlalchemy.ext.asyncio import create_async_engine
import asyncio
from tables import meta_obj
from dotenv import load_dotenv
import os


# Load ENV variables
load_dotenv()

# Engine
engine = create_async_engine(os.getenv("DB_URL"), echo=True)


# Create DB
async def main():
    async with engine.begin() as conn:
        await conn.run_sync(meta_obj.create_all)
        print("Connected to DB...")
    await engine.dispose()


asyncio.run(main())
```

> schema.py

```py
from pydantic import BaseModel
from datetime import datetime


class Post(BaseModel):
    id: int
    title: str
    description: str
    createdAt: datetime
    updatedAt: datetime
    author_id: int

    class Config:
        orm_mode = True


class PostBody(BaseModel):
    aid: int
    title: str
    description: str


class updateBody(BaseModel):
    title: str
    description: str
```

> tables.py

```py
from sqlalchemy import (
    MetaData,
    Column,
    Table,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
)
from datetime import datetime

meta_obj = MetaData()


# Users table
"""
Users Table
    - id (pk)
    - email (str)
    - password (str)
"""

args = [
    Column("id", Integer, primary_key=True),
    Column("email", String(50), unique=True, nullable=False),
    Column("password", String(50), nullable=False),
]
user_table = Table("users", meta_obj, *args)

# Post table
"""
Posts Table
    - id (pk)
    - title (str)
    - description (str)
    - createdAt(datetime)
    - updatedAt(datetime)
    - author_id (int,fk refrencing the id in user table)
"""

args = [
    Column("id", Integer, primary_key=True),
    Column("title", Text, unique=True, nullable=False),
    Column("description", Text, nullable=False),
    Column("createdAt", DateTime, default=datetime.utcnow),
    Column("updatedAt", DateTime, onupdate=datetime.utcnow),
    Column("author_id", Integer, ForeignKey("users.id")),
]
post_table = Table("posts", meta_obj, *args)
```

## A simple crud app using sqlalchemy orm,asyncpg,fastapi

.env

```
DB_URL=postgresql+asyncpg://postgres:@localhost/fastdb
```

> main.py

```py
import uvicorn
from fastapi import FastAPI
from sqlalchemy import delete, insert, select, update
from connectdb import engine
from connectdb import sess
from schema import Post, PostBody, updateBody
from connectdb import engine
from crud import get_all, create_, update_, delete_


app = FastAPI()


@app.get("/post", response_model=list[Post])
async def get_all_posts():
    data = await get_all(sess)
    return data


@app.get("/post/{id}", response_model=Post)
async def get_post_by_id(id: int):
    pass


@app.post("/post", response_model=Post)
async def create_post(bd: PostBody):
    data = await create_(sess, bd)
    return data


@app.put("/post/{id}")
async def update_post(id: int, bd: updateBody):
    data = await update_(sess, bd, id)
    return data


@app.delete("/post/{id}")
async def delete_post(id: int):
    data = await delete_(sess, id)
    return data


@app.get("/")
async def hello():
    return {"msg": "hello_world"}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True, log_level="info", workers=4, port=5000)
```

> connectdb.py

```py
from sqlalchemy import text, create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
import asyncio
from tables import Base
from dotenv import load_dotenv
import os


# Load ENV variables
load_dotenv()

# Engine
engine = create_async_engine(os.getenv("DB_URL"), echo=True)
sess = async_sessionmaker(bind=engine, expire_on_commit=False)


# Create DB
async def main():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("Connected to DB...")
    await engine.dispose()


asyncio.run(main())
```

> tables.py

```py
from sqlalchemy import (
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime,
)
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


# Users table
"""
Users Table
    - id (pk)
    - email (str)
    - password (str)
"""


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column("id", Integer, primary_key=True)
    email: Mapped[str] = mapped_column("email", String(50), nullable=False)
    password: Mapped[str] = mapped_column("password", String(50), nullable=False)
    posts: Mapped[list["Post"]] = relationship(
        "Post", back_populates="user", cascade="delete,all"
    )


# Post table
"""
Posts Table
    - id (pk)
    - title (str)
    - description (str)
    - createdAt(datetime)
    - updatedAt(datetime)
    - author_id (int,fk refrencing the id in user table)
"""


class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column("id", Integer, primary_key=True)
    title: Mapped[str] = mapped_column("title", Text, nullable=False)
    description: Mapped[str] = mapped_column("description", Text, nullable=False)
    createdAt: Mapped[DateTime] = mapped_column(
        "createdAt", DateTime, default=datetime.utcnow
    )
    updatedAt: Mapped[DateTime] = mapped_column(
        "updatedAt", DateTime, onupdate=datetime.utcnow, nullable=True
    )
    user_id: Mapped[int] = mapped_column(
        "user_id", Integer, ForeignKey("users.id"), nullable=False
    )
    user: Mapped[User] = relationship(
        "User", back_populates="posts", cascade="delete,all"
    )
```

> schema.py

```py
from pydantic import BaseModel
from datetime import datetime


class Post(BaseModel):
    id: int
    title: str
    description: str
    createdAt: datetime
    user_id: int

    class Config:
        orm_mode = True


class PostBody(BaseModel):
    aid: int
    title: str
    description: str


class updateBody(BaseModel):
    title: str
    description: str
```

> crud.py

```py
from sqlalchemy import delete, update
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy.sql import select
from tables import User, Post


async def get_all(sessmaker: async_sessionmaker[AsyncSession]):
    async with sessmaker() as session:
        st = select(Post)
        res = await session.execute(st)
        return res


async def get_by_id(sessmaker: async_sessionmaker[AsyncSession]):
    async with sessmaker() as session:
        pass


async def create_(sessmaker: async_sessionmaker[AsyncSession], data):
    async with sessmaker() as session:
        newpost = Post(title=data.title, description=data.description)
        newpost.user_id = data.aid

        session.add(newpost)
        await session.commit()
        print(newpost)
        return newpost


async def update_(sessmaker: async_sessionmaker[AsyncSession], data, id):
    async with sessmaker() as session:
        st = select(Post).where(Post.id == id)
        res = await session.execute(st)
        final_data = res.scalar()
        if final_data:
            if data.title:
                final_data.title = data.title
            if data.description:
                final_data.description = data.description
            await session.commit()
        return final_data


async def delete_(sessmaker: async_sessionmaker[AsyncSession], id):
    async with sessmaker() as session:
        print(id)
        st = delete(Post).where(Post.id == id)
        res = await session.execute(st)
        await session.commit()
        return res
```
