import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s);

const input = readLines("input.txt");

const int = s => parseInt(s,10)

const isRange = s => s.includes("-")
const notIsRange = s => !isRange(s)

const ranges = input.filter(isRange).map(s=>s.split("-")).map( ([min,max]) => [int(min), int(max)])

const ingredients = input.filter(notIsRange).map(int)

ranges.forEach(r => {
  r.contains = n  => r[0] <= n && n <= r[1]
  // r.intersects = q => (q[0] <= r[0] && q[1] >= r[1]) || (r[0] <= q[0] && r[1] <= q[1]) || (r[0] >= q[0] && q[1] <= r[1]) || (r[0] <= q[0] && r[1] >= q[1])
  r.intersects = q => (q[0] <= r[0] && q[1] >= r[1]) || (r[0] <= q[0] && r[1] >= q[0])|| (r[0] >= q[0] && q[1] >= r[0]) || (r[0] <= q[0] && r[1] >= q[1])
})

const merge = (r0, r1) => {
  r1[0] = Math.min(r0[0], r1[0])
  r1[1] = Math.max(r0[1], r1[1])
  r0[0] = 0
  r0[1] = 0
}


/*
r     |----|
q   |--------|

r  |----|
q   |-------|

r        |----|
q   |-------|

r   |-------|
q    |----|
*/

const isFresh = n => ranges.some(r => r.contains(n))

var part1 = ingredients.filter(isFresh).length

for (let i = 0; i < ranges.length; i++) {
  for (let j = i; j < ranges.length; j++) {
    if (i == j) continue;
    let r0 = ranges[i]
    let r1 = ranges[j]
    if (r0.intersects(r1)) merge(r0, r1)
  }
}

var part2 = ranges.filter(r => r[0] > 0).map(([a,b]) => b - a + 1).reduce((a,b)=>a+b, 0)

console.log("part 1:", part1);
console.log("part 2:", part2);
