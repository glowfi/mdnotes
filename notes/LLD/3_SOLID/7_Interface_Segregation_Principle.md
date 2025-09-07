# Interface Segregation Principle

### ISP

ISP states that we should not force our client to implement our interface
Instead of having one general purpose interface we should have multiple
client specific interface

> ISP violated

```py
from abc import ABC, abstractmethod


class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def volume(self) -> float:
        pass


class Rectange(Shape):
    def __init__(self, length: float, breadth: float) -> None:
        self.l = length
        self.b = breadth

    def area(self) -> float:
        return self.l * self.b

    # violates ISP as it forces client to implement an interface
    def volume(self) -> float:
        raise Exception("Rectange does not support volume as its not a 3d shape")


class Cube(Shape):
    def __init__(self, side: float) -> None:
        self.side = side

    def area(self) -> float:
        return 6 * (self.side**2)

    def volume(self) -> float:
        return self.side**3
```

> ISP followed

Now we have segregated the interface into multiple
client specific interface,namely 2d shape and 3d
shape interfaces

```py
from abc import ABC, abstractmethod


class TwoDShape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass


class ThreeDShape(ABC):
    @abstractmethod
    def volume(self) -> float:
        pass

    @abstractmethod
    def area(self) -> float:
        pass


class Rectangle(TwoDShape):
    def __init__(self, length: float, breadth: float):
        self.l = length
        self.b = breadth

    def area(self) -> float:
        return self.l * self.b


class Cube(ThreeDShape):
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return 6 * (self.side**2)

    def volume(self) -> float:
        return self.side**3
```
