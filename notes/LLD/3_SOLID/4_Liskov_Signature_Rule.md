# LSP Signature Rule

### Method argument rule

When overriding methods in subclasses, the types of the method arguments must be the
same or broader than those in the parent class (contravariance).
Narrowing them breaks substitutability and violates LSP.

> Method argument rule violated

```py
class Animal:
    def eat(self, food: str):
        print(f"Eating {food}")


class Bone:
    def __str__(self):
        return "a bone"


class Dog(Animal):
    # Narrowed argument type: only accepts "Bone" objects
    def eat(self, food: "Bone"):  #  Not LSP-compliant
        print(f"Dog chewing {food}")


if __name__ == "__main__":
    b = Bone()
    d = Dog()
    d.eat(b)
```

> Method argument rule followed

```py
class Animal:
    def eat(self, food: str):
        print(f"Eating {food}")


class Dog(Animal):
    # broader argument type
    def eat(self, food: str):  #  LSP-compliant
        print(f"Dog chewing {food}")


if __name__ == "__main__":
    d = Dog()
    d.eat("a bone")
```

### Method return type rule

When overriding methods in subclasses, the return type must be the same as,
or a narrowed down type, the parent’s return type. Returning a broader
or unrelated type breaks substitutability and violates LSP.

> Method return type violated

```py
from abc import ABC, abstractmethod


class Organism:
    def __str__(self):
        return "Organism"


class Animal(Organism):
    def __str__(self):
        return "Generic Animal"


class Dog(Animal):
    def __str__(self):
        return "Dog"


class Cat(Animal):
    def __str__(self):
        return "Cat"


class AnimalFeeder(ABC):
    # Parent contract:
    # - Argument: can feed ANY Animal
    # - Return: gives back an Animal
    @abstractmethod
    def feed(self, animal: Animal) -> Animal:
        pass


class DogOnlyFeeder(AnimalFeeder):
    # Return Type Rule violated:
    # Parent promised -> Animal
    # But child broadens it -> Organism (superclass of Animal)
    def feed(self, animal: Animal) -> Organism:
        if isinstance(animal, Dog):
            print(f"Feeding {animal}")
            return animal
        raise Exception("animal is not of type Dog")


if __name__ == "__main__":
    d = Dog()
    c = Cat()
    df = DogOnlyFeeder()
    df.feed(d)
```

> Method return type followed

```py
from abc import ABC, abstractmethod


class Organism:
    def __str__(self):
        return "Organism"


class Animal(Organism):
    def __str__(self):
        return "Generic Animal"


class Dog(Animal):
    def __str__(self):
        return "Dog"


class Cat(Animal):
    def __str__(self):
        return "Cat"


class AnimalFeeder(ABC):
    # Parent contract:
    # - Argument: can feed ANY Animal
    # - Return: gives back an Animal
    @abstractmethod
    def feed(self, animal: Animal) -> Animal:
        pass


class DogOnlyFeeder(AnimalFeeder):
    # Return Type Rule follwed:
    # Parent promised -> Animal
    # But child narrows it
    def feed(self, animal: Animal) -> Dog:
        if isinstance(animal, Dog):
            print(f"Feeding {animal}")
            return animal
        raise Exception("animal is not of type Dog")


if __name__ == "__main__":
    d = Dog()
    c = Cat()
    df = DogOnlyFeeder()
    df.feed(d)
```

### Exception rule

When overriding a method in a subclass , it should not throw new exceptions or broader exceptions than its base class.
It may throw fewer or narrower ones. Doing otherwise breaks Liskov Substitution Principle.

> Exception rule violated

```py
class AnimalFeeder:
    def feed(self, food: str) -> None:
        if food == "":
            raise ValueError("Food cannot be empty")
        print(f"Feeding animal with {food}")


class ExoticAnimalFeeder(AnimalFeeder):
    def feed(self, food: str) -> None:
        if food == "":
            # Broader exception than parent promised
            raise Exception("Something went wrong: no food!")
```

> Exception rule followed

```py
class AnimalFeeder:
    def feed(self, food: str) -> None:
        if food == "":
            raise ValueError("Food cannot be empty")
        print(f"Feeding animal with {food}")


class CarefulExoticAnimalFeeder(AnimalFeeder):
    def feed(self, food: str) -> None:
        if food == "":
            # Same exception type as parent, still safe
            raise ValueError("Food cannot be empty")
        print(f"Feeding animal with {food}")
```
