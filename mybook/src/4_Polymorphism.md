# Polymorphism

Polymorphism means abilty to exists in different form
We have mainly 2 types of polymorphism

- Dynamic -> method overriding (child class define their own method implementation)
- Static -> method overloading (a single class has multi methods with same name,return type but differnt args),operator overloading

```py
from abc import ABC, abstractmethod


class Car(ABC):
    def __init__(self, brand: str, model: str) -> None:
        self.brand = brand
        self.model = model
        self.isEngineOn = False
        self.speed = 0

    def start(self):
        self.isEngineOn = True

    def stop(self):
        self.isEngineOn = False
        self.speed = 0

    @abstractmethod
    def accelerate(
        self,
    ):  # Dynamic Polymorphism child class should implement this method
        pass

    # def accelerate(
    #     self, speed: float
    # ):  # Dynamic + Static Polymorphism child class should implement this [not supported in python]
    #     pass


class ManualCar(Car):
    def __init__(self, brand: str, model: str) -> None:
        super().__init__(brand, model)

    def accelerate(self):  # Dynamic polymorphism
        self.speed += 10
        print(
            f"{self.brand}{self.model} currently moving at speed at {self.speed}km/hr"
        )


class ElectricCar(Car):
    def __init__(self, brand: str, model: str) -> None:
        self.battery = 100
        super().__init__(brand, model)

    def accelerate(self):  # Dynamic polymorphism
        self.speed += 10
        self.battery -= 1
        print(
            f"{self.brand}{self.model} currently moving at speed at {self.speed}km/hr, battery :{self.battery}%"
        )


if __name__ == "__main__":
    mc = ManualCar("audi", "a8")
    mc.start()
    mc.accelerate()
    mc.accelerate()
    mc.stop()

    ec = ElectricCar("byd", "seal")
    ec.start()
    ec.accelerate()
    ec.accelerate()
    ec.stop()
```
