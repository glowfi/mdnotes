# Singleton Pattern

> The Singleton Pattern ensures a class has only one instance, and provides a global point of access to it

- Used by logging,caching,database connections

### Example

> Way of creating Singleton in python

```py
class Singleton:
    __instance = None

    @staticmethod
    def get_instance() -> "Singleton":
        if Singleton.__instance is None:
            Singleton.__instance = Singleton()
        return Singleton.__instance


s1 = Singleton.get_instance()
s2 = Singleton.get_instance()
s3 = Singleton.get_instance()
s4 = Singleton.get_instance()
s5 = Singleton.get_instance()

print(id(s1) == id(s3) == id(s5) == id(s2))
```

> Way of creating Singleton in python [thread safe]

```py
import threading


class Singleton:
    __instance = None
    __lock = threading.Lock()

    @staticmethod
    def get_instance() -> "Singleton":
        with Singleton.__lock:
            if Singleton.__instance is None:
                Singleton.__instance = Singleton()
            return Singleton.__instance


s1 = Singleton.get_instance()
s2 = Singleton.get_instance()
s3 = Singleton.get_instance()
s4 = Singleton.get_instance()
s5 = Singleton.get_instance()

print(id(s1) == id(s3) == id(s5) == id(s2))
```

> Way of creating Singleton in python [thread safe double locking]

```py
import threading


class Singleton:
    __instance = None
    __lock = threading.Lock()

    @staticmethod
    def get_instance() -> "Singleton":
        if Singleton.__instance is None:  # First check (no lock)
            with Singleton.__lock:
                if Singleton.__instance is None:  # Second check (with lock)
                    Singleton.__instance = Singleton()
        return Singleton.__instance


# Testing
s1 = Singleton.get_instance()
s2 = Singleton.get_instance()
s3 = Singleton.get_instance()
s4 = Singleton.get_instance()
s5 = Singleton.get_instance()

print(id(s1) == id(s2) == id(s3) == id(s4) == id(s5))
```

> Way of creating Singleton in golang [thread safe double locking]

```go
package main

import (
	"fmt"
	"sync"
)

type Singleton struct {
	val int
}

var (
	singletonInstance *Singleton
	mu                sync.Mutex
)

var c int

func getInstance() *Singleton {
	if singletonInstance == nil {
		mu.Lock()
		defer mu.Unlock()

		if singletonInstance == nil {
			singletonInstance = &Singleton{
				val: c,
			}
			c += 1
		}
	}
	return singletonInstance
}

func main() {
	wg := new(sync.WaitGroup)
	c := 100
	wg.Add(c)

	for i := 0; i < c; i++ {
		fmt.Println(getInstance())
		wg.Done()
	}

	wg.Wait()
}
```
