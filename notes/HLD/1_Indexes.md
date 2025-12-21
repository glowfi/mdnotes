# Disk Fundamentals

- disk have sectors,tracks
- intersection of them is blocks
- eacn block can be 4-16kb.

# Indexing Techniques

## 1. Hash Index

- Basic hashmap stored entirely in memory
- Requires instant random access, cannot afford disk seek latency
- Limited by available RAM, expensive to scale
- Fastest reads and writes among all techniques
- Cannot handle range queries efficiently
- Durability achieved through WAL
    - Append-only log on disk
    - Easy writes as pointer always at end
    - Replay log to rebuild hashmap after crash

## 2. B-Trees

- Self-balancing tree structure stored on disk
- No size limitation since disk-based
- Durability is inherent, less complex to manage
- Slower reads than hash index due to disk access
- Read complexity is O(logN)
- Write operations are slow due to tree rebalancing
- Excellent for range queries due to sorted tree structure
- Durability strategy
    - Avoid in-place updates
    - Write to separate pages first
    - Update references atomically afterward

## 3. LSM Tree with SSTable

### Core Structure

- In-memory balanced tree called Memtable
- Uses AVL or Red-Black tree implementation
- Memtable flushes to disk as SSTable when threshold reached

### Performance Characteristics

- Writes faster than B-Trees but slower than hash index
- Reads slower than B-Trees
- Must check Memtable first then all SSTables
- Range queries slower due to scattered data across SSTables

### Durability and Storage

- WAL handles crash recovery
- Replay WAL to restore Memtable state
- SSTables stored on disk removes memory size constraints
- No practical limit on total keys stored

### SSTable Properties

- Sorted by key
- Immutable once written
- Never modified in place

### Read Path

- Check Memtable first
- Search SSTables from newest to oldest
- Stop when key found

### Delete Operation

- Tombstone marker written as value
- Added to latest SSTable
- Actual removal happens during compaction

---

## LSM Optimizations

### Sparse Index

- Index containing subset of SSTable keys
- Stores memory location for indexed keys
- Binary search locates keys between indexed entries
- Reduces memory overhead compared to full index

### Bloom Filters

- Probabilistic data structure per SSTable
- Answers whether key possibly exists or definitely absent
- Avoids unnecessary SSTable reads for missing keys

### Compaction

- Background process merging multiple SSTables
- O(N) time complexity
- Removes duplicate and deleted keys
- Reduces total SSTable count
- Trade-off is CPU overhead affecting foreground operations

---

## LSM Write Flow

### Step 1: Incoming Write

- Key-value pair arrives at LSM Tree
- Written to active Memtable in sorted order
- Simultaneously appended to WAL for durability

### Step 2: Memtable Flush Trigger

- Memtable reaches size threshold
- Current Memtable frozen, no new writes accepted
- New empty Memtable created for incoming writes
- Frozen Memtable flushed to disk as immutable SSTable
- Flush happens in background, non-blocking

### Step 3: Continuous Operation

- New writes target active Memtable only
- Never written directly to existing SSTables
- Multiple SSTables accumulate over time

### Step 4: Compaction Process

- Triggered as SSTable count grows
- Merges multiple SSTables into fewer larger ones
- Discards overwritten key versions
- Removes tombstoned deletions
- Output is sorted, compacted SSTables
- Improves read performance by reducing files to search

## Question 1: Why LSM Tree has better write speed than B-Tree

### B-Tree Write Process

- B-Tree stores data directly on disk in sorted order
- Every write requires finding correct position in tree
- May trigger node splits when nodes overflow
- Node split causes multiple disk writes
- Updates happen in-place requiring random disk seeks
- Random I/O is slow on disk

### LSM Tree Write Process

- Writes go to in-memory Memtable first
- Memory writes are extremely fast
- WAL append is sequential disk write
- Sequential I/O is much faster than random I/O
- No immediate disk structure modification
- SSTable flush is one sequential bulk write
- No in-place updates ever

### Key Difference Summary

- B-Tree does random writes to disk on every operation
- LSM Tree batches writes in memory then does sequential disk writes
- Sequential writes can be 100x faster than random writes on HDD
- LSM trades immediate disk consistency for write throughput

### Interview One-Liner

LSM Tree converts random writes into sequential writes by buffering in memory and
flushing sorted batches, while B-Tree must perform random disk seeks for every write to maintain sorted structure.

---

## Question 2: Why Hash Index cannot do range queries but B-Tree and LSM can

### Hash Index Structure

- Keys stored based on hash function output
- Hash function distributes keys randomly across buckets
- Key "A" and key "B" may be in completely different locations
- No ordering relationship preserved
- To find keys between X and Y, must scan entire hashmap
- Full scan defeats purpose of index

### B-Tree Structure

- Keys stored in sorted order within tree nodes
- Left subtree contains smaller keys
- Right subtree contains larger keys
- Leaf nodes often linked for sequential access
- Range query process
    - Find start key using tree traversal
    - Follow leaf node links until end key
    - All keys in range are adjacent

### LSM Tree Structure

- Memtable is sorted balanced tree
- Each SSTable is sorted by key
- Range query process
    - Scan range in Memtable
    - Scan range in each SSTable
    - Merge results from all sources
- Sorting preserved at every level

### Core Insight

- Range queries require data locality
- Nearby keys must be stored nearby
- Hash function destroys this locality
- Tree structures preserve key ordering

### Interview One-Liner

Hash functions deliberately scatter keys randomly for uniform distribution, destroying any ordering relationship.
B-Trees and LSM Trees maintain sorted order, so adjacent keys are stored together, making range scans a simple sequential read.

---

## Question 3: Comparison of all three for range queries

### Hash Index Range Query

- Complexity is O(N) where N is total keys
- Must check every bucket
- No early termination possible
- Completely impractical for large datasets

### B-Tree Range Query

- Find start key in O(logN)
- Traverse leaf nodes sequentially
- Total complexity O(logN + K) where K is result size
- Single structure to search
- Most efficient for range queries

### LSM Tree Range Query

- Must check Memtable and all SSTables
- Each SSTable searched independently
- Results merged from multiple sources
- More I/O operations than B-Tree
- Complexity O(logN + K) per SSTable
- Compaction reduces SSTable count to improve this

### Why B-Tree wins for range queries

- Data in single sorted structure
- One sequential scan after finding start
- No merge step required
- Leaf nodes often physically sequential on disk

### Why LSM Tree is slower for range queries

- Data spread across multiple SSTables
- Same key range exists in multiple files
- Must read from all and merge
- Merge operation adds CPU overhead
- More disk seeks across files

### Interview One-Liner

B-Tree stores all data in one sorted structure allowing single sequential scan.
LSM Tree spreads data across Memtable and multiple SSTables requiring parallel
scans and merge operations, adding I/O and CPU overhead for range queries.
