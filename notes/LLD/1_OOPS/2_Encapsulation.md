# Encapsulation

Encapsulation is about bundling data and methods to protect the data
It deals with data security.
In python we can use access modifier to do data security
private methods/variables are prefixed with double underscore [can be only accessed within a class]
normally privated variable modification/viewing are done by using getter and setter
protected methods/variables are prefixed with single underscore [can be only accessed within a class and child classes]

```py
import uuid


class BankAccount:
    def __init__(self, initial_amount: float) -> None:
        self.__acount_number: uuid.UUID = uuid.uuid4()
        self.__curr_balance = initial_amount
        self.public_var = "sds"
        self._protected_var = "sds"

    def deposit(self, amount: float):
        if amount > 0:
            self.__curr_balance += amount
            print(f"Deposited ${amount}. New balance: ${self.__curr_balance}")
        else:
            print("Invalid deposit amount.")

    def withdraw(self, amount: float):
        if self.__curr_balance - amount > 0:
            self.__curr_balance -= amount
            print(
                f"Successfuly withdrawn {amount}. New balance: ${self.__curr_balance}"
            )
        else:
            print(f"Insufficient funds.Cannot withdraw {amount}.")

    def get_acc_details(self):  # Using getter to access private variables
        print("Acc no:", self.__acount_number)
        print("Curr bal:", self.__curr_balance)


class TestChildClass(BankAccount):
    def __init__(self, initial_amount: float) -> None:
        super().__init__(
            initial_amount
        )  # Must invoke the constructor of parent to access methods/variables

    def test(self):
        print(self.public_var)
        print(self._protected_var)
        self.withdraw(10)
        super().withdraw(10)


if __name__ == "__main__":
    acc = BankAccount(1000)
    acc.deposit(100)
    acc.deposit(100)
    acc.withdraw(100)
    acc.withdraw(10000)
    acc.get_acc_details()

    tc = TestChildClass(100)
    tc.test()
```
