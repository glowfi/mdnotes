# Inheritance

In Inheritance a child class inherits the properties and methods
of its parent class.Child class has access to all methods of
the parent class and on the top of that they can have their own
methods too.Python uses MRO (Method Resolution order) to determine
ordering of methods whithout ambiguity.MRO uses c3 linearization algo
under the hood

```py
class Car:
    def __init__(self, model: str, brand: str) -> None:
        self.model = model
        self.brand = brand
        self.isEngineOn = False

    def start(self):
        self.isEngineOn = True

    def stop(self):
        self.isEngineOn = False


class ManualCar(Car):
    def __init__(self, model: str, brand: str) -> None:
        super().__init__(model, brand)

    def shift_gear(self):  # Own specific methods
        print("gear shifted")


class Electric(Car):
    def __init__(self, model: str, brand: str) -> None:
        self.battery = 100
        super().__init__(model, brand)

    def charge_battery(self):  # Own specific methods
        print("battery charged!")


if __name__ == "__main__":
    mc = ManualCar("audi", "a8")
    ec = Electric("byd", "seal")

    mc.start()
    mc.shift_gear()
    mc.stop()

    ec.charge_battery()
    ec.start()
    ec.stop()
```
