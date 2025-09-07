# LSP Property Rule

### Class Invariant Rule

A class invariant is a condition (or set of properties) that must
always hold true for valid objects of that class.
A subclass must honor (preserve) all invariants of its parent.

> Class Invariant Rule violated

```py
class BankAccount:
    def __init__(self) -> None:
        self.balance: int = 0

    def set_balance(self, b: int):
        # bank balance cannot be negative
        assert b >= 0, "Dimensions must be non-negative"
        self.balance = b


class FunnyAccount(BankAccount):
    def __init__(self) -> None:
        self.balance: int = 0

    def set_balance(self, b: int):
        # CIR violated as it allows negative balance as well
        self.balance = b
```

> Class Invariant Rule followed

```py
class BankAccount:
    def __init__(self) -> None:
        self.balance: int = 0

    def set_balance(self, b: int):
        # bank balance cannot be negative
        assert b >= 0, "Dimensions must be non-negative"
        self.balance = b


class FunnyAccount(BankAccount):
    def __init__(self) -> None:
        self.balance: int = 0

    def set_balance(self, b: int):
        # bank balance cannot be negative
        assert b >= 0, "Dimensions must be non-negative"
        self.balance = b
```

### History Constraint

A subclass must not change how the object’s state is supposed to evolve over time compared to its parent class.
Parent’s promise: “If you deposit, balance goes up. If you withdraw, balance goes down.”
Child must follow the same story.
The subclass can add harmless side quests but not change the behaviour by increasing balance
on withdrawing

> History Constraint violated

```py
class BankAccount:
    def __init__(self):
        self.balance = 0

    # Balance can only increase on deposit, or decrease on valid withdraw.

    def deposit(self, amount: int):
        assert amount >= 0
        self.balance += amount

    def withdraw(self, amount: int):
        assert 0 <= amount <= self.balance
        self.balance -= amount

    def get_balance(self):
        return self.balance


class FunnyAccount(BankAccount):
    def withdraw(self, amount: int):
        # Breaks history: adds cashback surprise!
        super().withdraw(amount)
        self.balance += 1000  # Magical free bonus
```

> History Constraint followed

```py
class BankAccount:
    def __init__(self):
        self.balance = 0

    # Balance can only increase on deposit, or decrease on valid withdraw.

    def deposit(self, amount: int):
        assert amount >= 0
        self.balance += amount

    def withdraw(self, amount: int):
        assert 0 <= amount <= self.balance
        self.balance -= amount

    def get_balance(self):
        return self.balance


class PremiumAccount(BankAccount):
    def __init__(self):
        super().__init__()
        self.reward_points = 0

    def withdraw(self, amount: int):
        super().withdraw(amount)
        # Adds side-effect: gives reward points,
        # but doesn't mess with balance history
        self.reward_points += amount // 10
```
