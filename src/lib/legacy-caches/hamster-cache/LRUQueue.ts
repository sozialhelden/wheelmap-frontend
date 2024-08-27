export default class LRUQueue<K> {
  public lruRemovalQueue: K[] = []

  public keysToLRUQueueIndexes = new Map<K, number>()

  public push(key: K) {
    this.keysToLRUQueueIndexes.set(key, this.lruRemovalQueue.length)
    this.lruRemovalQueue.push(key)
  }

  public delete(key: K) {
    const lruIndex = this.keysToLRUQueueIndexes.get(key)
    if (lruIndex !== undefined) {
      this.lruRemovalQueue.splice(lruIndex, 1)
    }
    this.keysToLRUQueueIndexes.delete(key)
    return lruIndex
  }

  public touch(key: K) {
    this.delete(key)
    this.push(key)
  }

  public shift() {
    const key = this.lruRemovalQueue.shift()
    if (key !== undefined) {
      this.keysToLRUQueueIndexes.delete(key)
    }
    return key
  }

  public clear() {
    this.lruRemovalQueue = []
    this.keysToLRUQueueIndexes.clear()
  }

  public length() {
    return this.lruRemovalQueue.length
  }
}
