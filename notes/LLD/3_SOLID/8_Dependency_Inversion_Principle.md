# Dependency Inversion Principle

### DIP

DIP states that high level modules and low level modules
should interact with each other through an interface,
high level module should not depend on low level modules,
rather they should depend on interface.
If you want to do OCP then do DIP

> DIP violated

```py
class MongoDB:
    def save(self, data):
        print(f"Saving {data} into MongoDB")


class SQLDB:
    def save(self, data):
        print(f"Saving {data} into SQLDB")


class Client:
    # Client is heavily dependent on low level module details
    def __init__(self, mongo: MongoDB, sql: SQLDB) -> None:
        self.mongo = mongo
        self.sql = sql

    def save_to_mongo(self, data):
        self.mongo.save(data)

    def save_to_sql(self, data):
        self.sql.save(data)
```

> DIP followed

Now the high level module just need to know
about the contract/interface instead of being
heavily dependent on low level modules

```py
from abc import ABC, abstractmethod


class Persistence(ABC):
    @abstractmethod
    def save(self, data):
        pass


class MongoDB(Persistence):
    def save(self, data):
        print(f"Saving {data} into MongoDB")


class SQLDB(Persistence):
    def save(self, data):
        print(f"Saving {data} into SQLDB")


class Client:
    def __init__(self, db: Persistence) -> None:
        self.db = db

    def save(self, data):
        self.db.save(data)
```
