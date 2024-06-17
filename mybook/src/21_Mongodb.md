# MongoDB

> Connecting to mongodb

```sh
mongosh // connects to mongodb://127.0.0.1:27017 by default
mongo "mongodb+srv://cluster-name.abcde.mongodb.net/<dbname>" --username <username> // MongoDB Atlas
```

> Similarities

Note:

Tables -> Collections
Rows -> Documents
DBs -> DBs

> Basic commands

```sh
show dbs // show databases
use <dbname> // use or create database
show collections // show collections
```

> Collections

```sh
db.createCollection("coll") // creates the collection `coll`
db.coll.drop()    // removes the collection `coll`
```

### CRUD

> Create

```sh
db.coll.insertOne({name: "John Doe", age: 25}) // insert one document
db.coll.insertMany([{name: "John Doe", age: 25}, {name: "Alice", age: 30}]) // insert many documents
```

> Read

```sh
db.coll.count() // count all documents in 'coll' collection
db.coll.count({name: "John Doe"}) // count all documents with name "John Doe"

db.coll.find() // list all documents
db.coll.find({name: "John Doe"}) // list all documents with name "John Doe"
db.coll.find({name: "John Doe", age: 25}).limit(1) // list all documents with name "John Doe" and age 25, and return only one document.

db.Reviews.find({userId:"666258c68d02124bd1ddbadb"},{_id:true,comment:true}).limit(2) // only required fields
db.User.find({},{name:true}).limit(5).sort({name:-1}) // Sort by descending
db.User.find({},{name:true}).limit(5).sort({name:1}) // Sort by ascending
db.User.find({"address.country":"Lesotho"},{name:true}).limit(5).sort({name:-1}) // Nested Fields
db.User.find({"address.country":"Lesotho"},{name:true}).limit(5).count() // Count results

// Atomic operators
db.inventory.find( { quantity: { $in: [ 5, 15 ] } }, { _id: 0 } ) // in operator

db.coll.find({name: "John Doe"}).explain("executionStats") // find document and show execution stats
```

> Update

```sh
db.coll.update({name: "John Doe"}, {$set: {age: 26}}) // update all documents with name "John Doe" and set age to 26
db.coll.update({name: "John Doe"}, {$inc: {age: 1}}) // update all documents with name "John Doe" and increment age by 1

db.coll.update({name: "John Doe"}, {$unset: {age: 1}}) // update all documents with name "John Doe" and set age to null
db.coll.updateMany({age: {$exists: true}}, {$unset: {age: ""}}) // remove age field from all documents with age field
```

> Delete

```sh
db.coll.deleteMany({name: "John Doe"}) // remove all documents with name "John Doe"
db.coll.deleteOne({name: "John Doe"}) // remove one document with name "John Doe"
```

> ACID Compliance

| Properties  | Points                                                                                                                                                                                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Atomicity   | Means: A single transaction will take place or it will not take place.On error rollback will happen and on success data will be commited. mongodb historically supported for single documents only,now supports multi document                                                               |
| Consistency | Means: MongoDB uses schema validation, a feature that allows you to define the specific structure of documents in each MongoDB collection. If the document structure deviates from the defined schema, MongoDB will return an error. This is how MongoDB enforces its version of consistency |
| Isolation   | Means: Concurrent transaction run in some serial order to prevent data corruption and race condition.                                                                                                                                                                                        |
| Durability  | Measn : Data perssitence.If a data has been commited evn if the coputer crashes we will have the data stored into the disk                                                                                                                                                                   |

> Jsonschema

```sh
// Create collection with a $jsonschema
db.createCollection("hosts", {
    validator: {$jsonSchema: {
        bsonType: "object",
        required: ["email"], // required fields
        properties: {
            // All possible fields
            phone: {
                bsonType: "string",
                description: "must be a string and is required"
            },
            email: {
                bsonType: "string",
                pattern: "@mongodb\.com$",
                description: "must be a string and match the regular expression pattern"
            },
        }
    }}
})

```
