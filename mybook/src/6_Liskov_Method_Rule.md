# LSP Method Rule

### Pre condition rule

A precondition is something that must be true before a method can be safely called.
When you override a method in a subclass:
You must not strengthen (make stricter) the preconditions.

> Precondition rule violated

```py
class User:
    def __init__(self) -> None:
        self.pw = ""

    def set_password(self, pw: str):
        assert len(pw) >= 8, "password must be greater than 8 characters"
        self.pw = pw


class AdminUser(User):
    def __init__(self) -> None:
        super().__init__()

    def set_password(self, pw: str):
        # precondition rule broken as we have strengthened the condition
        assert len(pw) >= 100, "password must be greater than 100 characters"
        self.pw = pw
```

> Precondition rule followed

```py
class User:
    def __init__(self) -> None:
        self.pw = ""

    def set_password(self, pw: str):
        assert len(pw) >= 8, "password must be greater than 8 characters"
        self.pw = pw


class AdminUser(User):
    def __init__(self) -> None:
        super().__init__()

    def set_password(self, pw: str):
        # precondition rule followed as we have weakend the condition
        assert len(pw) >= 16, "password must be greater than 6 characters"
        self.pw = pw

```

### Post condition rule

A postcondition defines what is guaranteed to hold after a method finishes.
When you override a method in a subclass:
You must not weaken (relax) the postconditions.
Subclasses must honor or strengthen the postconditions defined by their parent. They may
guarantee more, but they must never promise less.

> Post condition rule violated

```py

class BankAccount:
    def __init__(self):
        self.balance = 0

    # When you deposit an amount amt then it get deposited
    def deposit(self, amount: int):
        if amount < 0:
            raise ValueError("Deposit must be non-negative")
        self.balance += amount


class FunnyAccount(BankAccount):
    def deposit(self, amount: int):
        if amount < 0:
            raise ValueError("Deposit must be non-negative")
        # Violates postcondition: only half is deposited!
        self.balance += amount // 2
```

> Post condition rule followed

```py

class BankAccount:
    def __init__(self):
        self.balance = 0

    # When you deposit an amount amt then it get deposited
    def deposit(self, amount: int):
        if amount < 0:
            raise ValueError("Deposit must be non-negative")
        self.balance += amount


class FunnyAccount(BankAccount):
    def deposit(self, amount: int):
        if amount < 0:
            raise ValueError("Deposit must be non-negative")
        self.balance += amount
        # Stronger guarantee: add bonus interest too
        self.balance += 10
```
