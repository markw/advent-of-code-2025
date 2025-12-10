import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n")

const parse = id => {
  const [x, y, z] = id.split(",").map(s=>parseInt(s,10))
  return { id, x, y, z }
}

const input = readLines("input.txt").filter(s=>s).map(parse)

const pairs = []

for (let i=0; i< input.length; i++) {
  for (let j=i+1; j< input.length; j++) {
    const a = input[i]
    const b = input[j]
    const dist = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2))
    pairs.push({a,b,dist})
  }
}

pairs.sort((a,b) => {
  if (a.dist < b.dist) return -1
  if (a.dist > b.dist) return 1
  return 0
})

const matches = (a,b) => a.x == b.x && a.y == b.y && a.z == b.z
const pairsMatch = (p0, p1) => matches( p0.a, p1.a ) || matches( p0.b, p1.b ) || matches( p0.a, p1.b ) || matches( p0.b, p1.a )
const circuits = input.map(c=>new Set([c.id]))

var index = 0
for (var i = 0; i < 1000; i++) {
  const {a,b} = pairs[index++]
  //console.log("pair", a.id, b.id)
  const ca = circuits.find(c => c.has(a.id))
  const cb = circuits.find(c => c.has(b.id))
  // console.log("ca", ca, "cb", cb)
  if (ca != cb) {
    //console.log("connecting", a.id, b.id)
    cb.forEach(c => ca.add(c))
    cb.clear()
  }
  const filtered = circuits.filter(c=>c.size > 0)
  //console.log(filtered.length,"circuits")
  //console.log(filtered)
}

const byInt = (a,b) => a < b ? -1 : a > b ? 1 : 0
const part1 = circuits.map(c=>c.size).sort(byInt).slice(-3).reduce((a,b)=>a*b,1) 
console.log("part 1:", part1);

// part 2
var ax = 0
var bx = 0
while (circuits.filter(c=>c.size).length > 1) {
  const {a,b} = pairs[index++]
  const ca = circuits.find(c => c.has(a.id))
  const cb = circuits.find(c => c.has(b.id))
  if (ca != cb) {
    //console.log("connecting", a.id, b.id)
    cb.forEach(c => ca.add(c))
    cb.clear()
    ax = a.x
    bx = b.x
  }
}

const part2 = ax * bx;

console.log("part 2:", part2);

