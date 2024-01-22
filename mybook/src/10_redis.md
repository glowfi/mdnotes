# Redis

> Redis is a memory-based database that is commonly used for caching purposes.
> When we have a value that takes a long time to compute, we can cache it in Redis and
> retrieve it quickly when we need it. This can significantly improve the performance
> of our application by reducing the time it takes to compute the value.

### Key Value pair

```sh
# Set/Update key value
set name john

# Will return 1 if exists or 0 if not exists and will print the name if exists
get name

# Will return 1 if exists or 0 if not exists and will delete the key if exists
del name

# List all
keys *

# Delete all
flushall

# Get time to live
ttl name

# Set expiry time
EXPIRE name 10

# set with expiry time
setex name 10 john
```

### Lists

```sh
# Push from the left and right
lpush arr john johnny
rpush arr hello hello2

# List all
range arr 0 -1

# Remove from left and right
lpop arr
rpop arr

# delete list
del arr
```

### Sets [store unique values]

```sh
# Add to set
SADD hobbies "hello" 1 2

# List all members
SMEMBERS hobbies

# Remove members
SREM hobbies "hello"
```

### Hashes [key value pair inside of a key value]

**No nesting allowed.Imagine a JSON object we cannot have json inside json.**

```sh

# Set an attribute to hashset person
HSET person name john

# Get a single attribute from hashset person
HGET person name

# Getall attributes from hashset person
HGETALL person

# delete hashset attribute
HDEL person name

# delete hashset
DEL person
```
