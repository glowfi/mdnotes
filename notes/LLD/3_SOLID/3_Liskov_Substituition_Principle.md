# Liskov Substituition Principle

LSP states that we should be able to replace a base class
with its child class easily without breaking any part of
the system. A child class should always extend the features
of its parent class but it should not narrow down the features
of its parent class.

> LSP violated

Below i have taken an example of bank account,A bank account
is an abstract class from which we have 3 child class implementing
it.We have a savings account,salary account and fixed deposit account.
But one thing to consider that a fixed deposit account does not have
withdraw functionality in real life but we are overrding the method
but not implementing it just throwing an error but this breaks LSP
because when the client will call its withdraw function it will get an
error.

```py
from abc import ABC, abstractmethod


class BankAccount(ABC):
    @abstractmethod
    def deposit(self):
        pass

    @abstractmethod
    def withdraw(self):
        pass


class SavingsAcount(BankAccount):
    def deposit(self):
        pass

    def withdraw(self):
        pass


class SalaryAcount(BankAccount):
    def deposit(self):
        pass

    def withdraw(self):
        pass


class FixedTermAccound(BankAccount):
    def deposit(self):
        pass

    def withdraw(self):
        raise Exception("cannot withdraw from fixed account")


class BankAccountClient:
    def __init__(self) -> None:
        self.accounts: list[BankAccount] = []

    def add_bank_account(self, account: BankAccount):
        self.accounts.append(account)

    def withdraw_from_all(self):
        for account in self.accounts:
            # Will get an exception for fixed deposit accounts
            # Wrong way of handling it and breaks LSP
            if isinstance(account, FixedTermAccound):
                continue
            else:
                account.withdraw()
```

> LSP followed

```py
from abc import ABC, abstractmethod


class DepositableBankAccount(ABC):
    @abstractmethod
    def deposit(self):
        pass


class WithdrawableBankAccount(DepositableBankAccount, ABC):
    @abstractmethod
    def withdraw(self):
        pass


class SavingsAcount(WithdrawableBankAccount):
    def deposit(self):
        pass

    def withdraw(self):
        pass


class SalaryAcount(WithdrawableBankAccount):
    def deposit(self):
        pass

    def withdraw(self):
        pass


class FixedTermAccound(DepositableBankAccount):
    def deposit(self):
        pass


class BankAccountClient:
    def __init__(self) -> None:
        self.withdrwable_accounts: list[WithdrawableBankAccount] = []
        self.depositable_accounts: list[DepositableBankAccount] = []

    def add_withdrawable_bank_account(self, account: WithdrawableBankAccount):
        self.withdrwable_accounts.append(account)

    def add_depositable_bank_account(self, account: DepositableBankAccount):
        self.depositable_accounts.append(account)

    def withdraw_from_all(self):
        # Following LSP
        for account in self.withdrwable_accounts:
            account.withdraw()
```
