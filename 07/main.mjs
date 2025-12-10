import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n")

const grid = readLines("input.txt").filter(s=>s)

const nodeCache = new Map()

const makeNode = (value) => {
  const key = value.toString()
  if (nodeCache.has(key)) {
    return nodeCache.get(key)
  } else {
    const node = Node(value)
    nodeCache.set(key, node)
    return node
  }
}

const Node = (value) => ({
  children: [],
  value,
  addChild: function (node) {
    const hasChild = this.children.some(n => n.value[0] == node.value[0] && n.value[1] == node.value[1])
    if (!hasChild) {
      this.children.push(node)
    }
    return node
  },
})

const down   = ([r,c]) => [r + 1, c]
const left   = ([r,c]) => [r, c - 1]
const right  = ([r,c]) => [r, c + 1]
const charAt = ([r,c]) => grid[r][c]

var s = grid[0].indexOf('S')

var row = 1
const root = Node([0, s])
var nodes = [root]
var levels = [nodes]
var numSplits = 0
while (row++ < grid.length - 1) {
  const seen = new Set()
  nodes = nodes.flatMap(node =>  {
    const rc = down(node.value)
    if ( "^" == charAt(rc)) {
      numSplits++
      const a = []

      const l = left(rc)
      const ls = l.toString()
      const leftChild = makeNode(l)
      node.addChild(leftChild)
      if (!seen.has(ls)) {
        a.push(leftChild) 
        seen.add(ls)
      }

      const r = right(rc)
      const rs = r.toString()
      const rightChild = makeNode(r)
      node.addChild(rightChild)
      if (!seen.has(rs)) {
        a.push(rightChild) 
        seen.add(rs)
      }
      return a
    }
    const ns = node.value.toString() 
    const child = makeNode(rc)
    node.addChild(child)
    if (!seen.has(ns)) {
      seen.add(ns)
      return [child]
    } else return []
  })
  levels.push(nodes)
}

function bfs() {
  levels.reverse().forEach(r=>{
    r.forEach(n => {
      n.numPaths = n.children.length == 0 ? 1 : n.children.reduce((a,b)=>a+b.numPaths, 0)
    })
  })
  return levels.at(-1)[0].numPaths
}

const part1 = numSplits
const part2 = bfs();

console.log("part 1:", part1)
console.log("part 2:", part2)

