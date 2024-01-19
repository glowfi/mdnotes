# SQL Alchemy

## Install

```sh
pip install virtualenv
mkdir sqlalc
cd sqlalc
python -m venv env
source ./env/bin/activate.fish
pip install sqlalchemy asyncio aiosqlite
```

## SQL Alchemy Core

> It is a Low level API which give us more control over the
> queries we write. It provides us with the feature of writing raw sql queries.

#### Connecting with a database

```py
from sqlalchemy import create_engine, text

# Initialize engine
DB_URL = "sqlite:///test.db"
engine = create_engine(DB_URL, echo=True)

# Establish connection with the database
with engine.connect() as conn:
    # Execute raw sql query
    statement = text("select 100+200;")
    res = conn.execute(statement)
    print(res.all())
```

#### Defining schema of db

In SQLAlchemy Core, the metadata object is used to define the structure of
the database tables and their relationships. It is a container for
all the table definitions and provides a way to introspect the database schema.

```py
from sqlalchemy import ForeignKey, MetaData, String, Table, Column, Integer, Text


# MetaData object
meta_obj = MetaData()

### Users Table

"""
Users Table
    - id (pk)
    - name (str)
    - fullname (str)
    - email (str)
"""

user_schema = [
    Column("id", Integer, primary_key=True),
    Column("name", String(30), nullable=False),
    Column("fullname", String(50), nullable=False),
    Column("email", String(30), nullable=False),
]
user_table = Table("users", meta_obj, *user_schema)

### Comments Table

"""
Comments Table
    - id (pk)
    - comment (str)
    - user_id (int,fk refrencing the id in user table)
"""

comments_schema = [
    Column("id", Integer, primary_key=True),
    Column("comment", Text, nullable=False),
    Column("user_id", Integer, ForeignKey("users.id")),
]
comments_table = Table("comments", meta_obj, *comments_schema)
```

#### Creating Tables

```py
from connect import engine
from tables import meta_obj


# Create all the tables
meta_obj.create_all(bind=engine)
```

#### Inserting Data

```py
from sqlalchemy import insert
from connect import engine
from tables import user_table


with engine.connect() as conn:
    # Insert Single Data
    user = {"name": "John", "fullname": "John Doe", "email": "john@doe.com"}
    statement = insert(user_table).values(**user)
    conn.execute(statement)
    conn.commit()

    # Insert Multiple Data
    users = [
        {"name": "Jake", "fullname": "Jake Doe", "email": "jake@doe.com"},
        {"name": "Joe", "fullname": "Joe Smith", "email": "joe@smith.com"},
    ]

    statement = insert(user_table)
    conn.execute(statement, users)
    conn.commit()
```

#### Selecting Data

```py
from sqlalchemy import select
from tables import user_table
from connect import engine


with engine.connect() as conn:
    # Simple select statement
    statement = select(user_table)
    res = conn.execute(statement)
    print(res.all())

    # Select statement with where clause
    statement = select(user_table).where(user_table.c.id == 3)
    res = conn.execute(statement)

    # For priting all rows
    for row in res:
        print(row)
```

#### Updating Data

```py
from sqlalchemy import update
from tables import user_table
from connect import engine


with engine.connect() as conn:
    # Updated Data
    statement = update(user_table).where(user_table.c.id == 1).values(name="Updated")
    conn.execute(statement)
    conn.commit()
```

#### Deleting Data

```py
from sqlalchemy import delete
from tables import user_table
from connect import engine


with engine.connect() as conn:
    # Delete data
    statement = delete(user_table).where(user_table.c.id == 1)
    conn.execute(statement)
    conn.commit()
```

## SQLAlchemy ORM

> It is a high level API to interact with the database. Here we can define python classes which directly maps to db tables,
> providing us a more pythonic way to interact with the database.

An Object-Relational Mapping (ORM) is a tool or software library that allows programmers to
interact with databases using an object-oriented programming language, rather than writing
SQL queries directly.

**Advantages of ORMs**:

-   Simplified database access: ORMs provide a simple and intuitive way to interact with databases, allowing developers to focus on their application logic instead of writing complex SQL queries.
-   Improved productivity: ORMs reduce the amount of boilerplate code required to perform common database operations, such as creating, reading, updating, and deleting records.
-   Consistency: ORMs provide a consistent interface for working with different types of databases, making it easier to switch between them or use multiple databases in the same application.
-   Type safety: ORMs can provide type safety, which means that the compiler can check for errors at compile time instead of runtime, reducing the risk of runtime errors.
-   Abstraction: ORMs abstract away the underlying database implementation, making it easier to write database-agnostic code.

**Disadvantages of ORMs**:

-   Performance overhead: ORMs can introduce performance overhead due to the additional layer of abstraction between the application and the database.
-   Limited query capabilities: ORMs may not support all SQL queries or features, limiting the flexibility of the developer when working with complex data.
-   Learning curve: ORMs can have a steep learning curve, especially for developers who are new to object-relational mapping.
-   Complexity: ORMs can add complexity to the application, making it harder to debug and maintain.
-   Lazy loading: ORMs often use lazy loading to fetch related data only when it's needed, but this can result in multiple round trips to the database, leading to performance issues.

#### Connecting with a database

```py
from sqlalchemy import create_engine, text

# Initialize engine
DB_URL = "sqlite:///test.db"
engine = create_engine(DB_URL, echo=True)

# Establish connection with the database
with engine.connect() as conn:
    # Execute raw sql query
    statement = text("select 1+1;")
    res = conn.execute(statement)
    print(res.all())
```

#### Defining schema of db

```py
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


# Base class
class Base(DeclarativeBase):
    pass


# Users Table


class Users(Base):
    """
    User Table
        - id (pk)
        - name (str)
        - fullname (str)
        - email (str)
    """

    __tablename__ = "users"
    id: Mapped[int] = mapped_column("id", Integer, primary_key=True)
    name: Mapped[str] = mapped_column("name", String(30), nullable=False)
    fullname: Mapped[str] = mapped_column("fullname", String(50), nullable=False)
    email: Mapped[str] = mapped_column("email", String(30), nullable=False)
    comments: Mapped[list["Comments"]] = relationship(
        back_populates="user", cascade="delete,all"
    )

    # def __repr__(self):
    #     return f"Username: {self.fullname} Email: {self.email}"


# Comments Table


class Comments(Base):
    """
    Comment Table
        - id (pk)
        - comment (str)
        - user_id (int,fk referencing the id in user table)
    """

    __tablename__ = "comments"
    id: Mapped[int] = mapped_column("id", Integer, primary_key=True)
    comment: Mapped[str] = mapped_column("comment", Text, nullable=False)
    user_id: Mapped[int] = mapped_column("user_id", Integer, ForeignKey("users.id"))
    user: Mapped[Users] = relationship(back_populates="comments", cascade="delete,all")

    # def __repr__(self):
    #     return f"Comment: {self.comment} Comment By: {self.user.fullname}"
```

#### Creating Tables

```py
from connect import engine
from tables import Base


Base.metadata.create_all(bind=engine)
```

#### Inserting into Table

```py
from sqlalchemy.orm import Session
from tables import Users, Comments
from connect import engine


# Session object
session = Session(bind=engine)


# Insert users
user1 = Users(
    name="John",
    fullname="John Doe",
    email="john@doe.com",
    # comments=[Comments(comment="hello"), Comments(comment="hey there")],
)

# Adding Single User
session.add(user1)
session.commit()


# Adding Multiple User
user2 = Users(
    name="Jake",
    fullname="Jake Smith",
    email="jake@smith.com",
    # comments=[Comments(comment="hello2"), Comments(comment="hey there2")],
)
user3 = Users(
    name="Joe",
    fullname="Joe Smith",
    email="joe@smith.com",
    # comments=[Comments(comment="hello3"), Comments(comment="hey there3")],
)

session.add_all([user2, user3])
session.commit()


# Add a smaple comment
comment1 = Comments(comment="hello world", user_id=1)
session.add(comment1)
session.commit()
```

#### Selecting

```py
from sqlalchemy import and_, select
from sqlalchemy.orm import Session
from connect import engine
from tables import Users


# Session object
session = Session(bind=engine)


# With ORM

## Simple select statement
res = session.query(Users)

## Simple select with where clause and session execute
statement = select(Users).where(Users.name.in_(["Jake", "Joe"]))
res = session.execute(statement)
print(res.all())

# filter vs filter_by

## Select with filter_by [Takes dict like kwargs keyword arguments for and arguments]
statement = select(Users).filter_by(name="John", id=1)
res = session.execute(statement)
print(res.all())

## Select with filter [for and/or arguments]
statement = select(Users).filter(and_(Users.name == "John", Users.id == 1))
res = session.execute(statement)

## scalar vs one
# + scalar will not raise exception if no rows present
# + one will raise exception if no rows present

## Getting user comment using scalars [can be derefrenced using dot]
for i in res.scalars():
    for comment in i.comments:
        print(comment.comment)
```

#### Joining

```py
from sqlalchemy.orm import Session
from connect import engine
from tables import Users, Comments
from sqlalchemy import select

session = Session(bind=engine)

# Left Join
statement = select(Users).join(Comments, Users.id == Comments.user_id)
rs = session.execute(statement)
print(rs.all())
```

#### Updating

```py
from sqlalchemy import select
from sqlalchemy.orm import Session
from connect import engine
from tables import Users

session = Session(bind=engine)

# Return None if no results found
res = session.query(Users).filter(Users.id == 1).first()

if res:
    res.name = "newname"
    res.fullname = "New Name"
    session.commit()
```

#### Deleting

```py
from sqlalchemy import select
from sqlalchemy.orm import Session
from connect import engine
from tables import Users

session = Session(bind=engine)

# Return None if no results found
res = session.query(Users).filter(Users.id == 1).first()

if res:
    session.delete(res)
    session.commit()
```

## SQL Alchemy [core+orm] asyncio

#### Core

```py
from sqlalchemy.ext.asyncio import create_async_engine
import asyncio
from sqlalchemy import Integer, MetaData, Table, Column, Text, insert
from sqlalchemy.sql import select


meta_obj = MetaData()
user_table = Table(
    "users",
    meta_obj,
    Column("id", Integer, primary_key=True),
    Column("name", Text, nullable=True),
)


async def main():
    DB_URL = "sqlite+aiosqlite:///test.db"
    engine = create_async_engine(DB_URL, echo=True)

    # can use begin -> auto-commit ater transaction
    async with engine.begin() as conn:
        # Create db

        # meta_obj.create_all(bind=engine) [OLD]

        # [NEW]
        await conn.run_sync(meta_obj.create_all)

        # Insert Data
        statement = insert(user_table).values(name="John Doe")
        await conn.execute(statement)

        # Select Data
        statement = select(user_table)
        res = await conn.execute(statement)
        print(res.all())

    await engine.dispose()


asyncio.run(main())
```

# Note:

In SQLAlchemy, the term "expire on commit" refers to a configuration option for a session object
that determines whether or not the state of objects loaded from the database will be set to
"expired" when a transaction is committed. When an object's state is expired, it means that any
changes made to the object during the transaction will be discarded, and the next time the object is
accessed, its state will be reloaded from the database.

#### ORM

```py
from sqlalchemy import Integer, Text, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
import asyncio
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column("id", Integer, primary_key=True)
    name: Mapped[str] = mapped_column("name", Text, nullable=False)


async def insert_data(sessmaker: async_sessionmaker[AsyncSession]):
    async with sessmaker() as session:
        newuser = Users(name="John Doe")
        session.add(newuser)
        await session.commit()


async def insert_data(sessmaker: async_sessionmaker[AsyncSession]):
    async with sessmaker() as session:
        st = select(Users).filter(Users.name == "John Doe")
        res = await session.execute(st)
        ans = res.scalars().first()

        if ans:
            print(ans.name)


async def main():
    # Initialize engine
    DB_URL = "sqlite+aiosqlite:///test.db"
    engine = create_async_engine(DB_URL, echo=True)

    # Session maker
    # session=Session(bind=engine) [OLD]

    # New
    session = async_sessionmaker(bind=engine, expire_on_commit=False)

    async with engine.begin() as conn:
        # Create db
        await conn.run_sync(Base.metadata.create_all)

    async with engine.connect() as conn:
        # Insert Data
        # await insert_data(session)

        # Select Data
        await insert_data(session)


asyncio.run(main())
```
