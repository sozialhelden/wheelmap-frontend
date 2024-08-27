import LRUQueue from './LRUQueue'

describe('LRUQueue', () => {
  it('pushes and moves new item to the back', () => {
    const queue = new LRUQueue<string>()
    queue.push('X')
    queue.push('Y')
    expect(queue.length()).toBe(2)
    expect(queue.shift()).toEqual('X')
    expect(queue.shift()).toEqual('Y')
    expect(queue.length()).toBe(0)
  })

  it('moves a touched item to the back', () => {
    const queue = new LRUQueue<string>()
    queue.push('X')
    queue.push('Y')
    queue.push('Z')
    queue.touch('Y')
    expect(queue.length()).toBe(3)
    expect(queue.shift()).toEqual('X')
    expect(queue.shift()).toEqual('Z')
    expect(queue.shift()).toEqual('Y')
    expect(queue.length()).toBe(0)
  })

  it('can delete items', () => {
    const queue = new LRUQueue<string>()
    queue.push('X')
    queue.push('Y')
    queue.push('Z')
    expect(queue.length()).toBe(3)
    queue.delete('Y')
    expect(queue.length()).toBe(2)
    expect(queue.shift()).toEqual('X')
    expect(queue.length()).toBe(1)
    expect(queue.shift()).toEqual('Z')
    expect(queue.length()).toBe(0)
    expect(queue.shift()).toBeUndefined()
    expect(queue.length()).toBe(0)
  })

  it('clears items on request', () => {
    const queue = new LRUQueue<string>()
    queue.push('X')
    queue.push('Y')
    queue.push('Z')
    expect(queue.length()).toBe(3)
    queue.clear()
    expect(queue.length()).toBe(0)
    expect(queue.shift()).toBeUndefined()
    expect(queue.length()).toBe(0)
  })
})
