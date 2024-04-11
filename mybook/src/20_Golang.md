# Golang Basics

### Simple hello world

> Strings must be enclosed within double quotes
> Characters must be enclosed within single quotes

```go
package main
import "fmt"

func main() {
    // New Line printing
    fmt.Println("Hello!")

    // Print in the same line
    fmt.Print("Hello!")
}
```

### Building and Running

> Build

```sh
go build <name_of_file>
```

> Run

```sh
go build <name_of_file>
```

### Variables and Data-types

> Number

> Unsigned Integers (no negatives)

-   uint8 / byte (0 - 255)
-   uint16 (0 - 65535)
-   uint32 (0 to 4294967295)
-   uint64 (0 to 18446744073709551615)

> Signed Integers

-   int8 (-128 to 127)
-   int16 (-32768 to 32767)
-   int32 / rune (-2147483648 to 2147483647)
-   int64 (-9223372036854775808 to 9223372036854775807)

> 3 Machine Dependent Types

-   uint 32 or 64 bits)
-   int (same size as uint)
-   uintptr (an unsigned integer to store the uninterpreted bits of a pointer value)

> Floating Point Numbers

-   float32 (IEEE-754 32-bit floating-point numbers)
-   float64 (IEEE-754 64-bit floating-point numbers)

> Complex (Imaginary Parts)

-   complex64 (Complex numbers with float32 real and imaginary part)
-   complex128 (Complex numbers with float64 real and imaginary part)

```go
package main

import "fmt"

func main() {

	// Can change later
	// var name string
	// name = "Bill"
	// name = "asd"

	var a bool = true    // Boolean
	var b uint = 5       // Integer
	var c float32 = 3.14 // Floating point number
	var d string = "Hi!" // String
	b += 10

	fmt.Println("Boolean: ", a)
	fmt.Println("Integer: ", b)
	fmt.Println("Float:   ", c)
	fmt.Println("String:  ", d)
}
```
