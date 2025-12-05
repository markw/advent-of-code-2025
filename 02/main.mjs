import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s);

const input = readLines("input.txt")[0];

const log = s => console.log(s);

const range  = ([s1,s2]) => {
  var x = parseInt(s1);
  var y = parseInt(s2);
  var r = [];
  while (x <= y) {
    r.push(x++);
  }
  return r;
}

const part1 = input.split(",")
  .map(s=>s.split("-"))
  .map(range)
  .flat()
  .map(s => s.toString() )
  .filter(s => s.length % 2 == 0)
  .filter(s => {
    const size = s.length / 2
    const start = s.slice(0, size)
    const end = s.slice(size)
    return start == end
  })
  .map(s => parseInt(s))
  .reduce((a,b)=>a+b, 0)


const partition = (s,n)  => {
  //console.log("partition",s,n);
  const result = []
  var i = 0
  while (i < s.length) {
    result.push(s.substr(i,n))
    i += n
  }
  return result
}

const isInvalid = (s) => {
  const limit = Math.trunc(s.length / 2)
  for (var i = 1; i <= limit; i++) {
    const size = new Set(partition(s, i)).size
    if (size == 1) { return true }
  }
  return false
}

const part2 = input.split(",")
  .map(s=>s.split("-"))
  .map(range)
  .flat()
  .map(s => s.toString() )
  .filter(isInvalid)
  .map(s => parseInt(s))
  .reduce((a,b)=>a+b, 0)

console.log("part 1:", part1);
console.log("part 2:", part2);
