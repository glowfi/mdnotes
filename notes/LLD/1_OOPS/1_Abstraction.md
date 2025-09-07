# Abstraction

Abstraction focuses on implementation hiding providing the user with
a simple interface to interact with the object.User does not need to
know internal working of the object just need to know the behaviour
of the object. A class has the behaviour(methods) and properties(variables)
of the object.

```py
from abc import ABC, abstractmethod


class Car(
    ABC
):  # interface defining the methods , methods are to be implemented by class implementing this abstract class
    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def accelerate(self):
        pass

    @abstractmethod
    def deccelerate(self):
        pass

    @abstractmethod
    def stop(self):
        pass


class SportsCar(Car):
    def __init__(self) -> None:
        self.curr_speed = 0
        self.isEngineOn = False

    def start(self):
        self.isEngineOn = True
        print("car engine is on")

    def stop(self):
        self.curr_speed = 0
        self.isEngineOn = False
        print("car stoppped")

    def accelerate(self):
        self.curr_speed += 20
        print(f"car is moving at speed of {self.curr_speed}km/h")

    def deccelerate(self):
        self.curr_speed -= 20
        print(f"car is moving at speed of {self.curr_speed}km/h")


if __name__ == "__main__":
    spc = SportsCar()

    spc.start()
    spc.accelerate()
    spc.accelerate()
    spc.accelerate()
    spc.deccelerate()
    spc.accelerate()
    spc.stop()
```
