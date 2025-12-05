import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s).map(s=>s.split(''))

const adjacents = [
  [ 1, 1],
  [ 1, 0],
  [ 1,-1],
  [ 0, 1],
  [ 0,-1],
  [-1, 1],
  [-1, 0],
  [-1,-1],
]

const grid = readLines("input.txt");

const walk = (grid) => {
  let accessible = []
  for (let r=0; r<grid.length; r++) {
    for (let c=0; c<grid[0].length; c++) {
      let numNeighbors = 0
      const ch = grid[r][c]
      if (ch == '@') {
        const neighbors = adjacents.map(([r1,c1]) => {
          const row = r + r1
          const col = c + c1
          if ( grid[row]?.[col] == '@') { numNeighbors++ }
        })
        
        if (numNeighbors < 4) {
          // console.log("adding row", r, "col", c, "neighbors", numNeighbors)
          accessible.push([r,c])
        }
      }
    }
  }
  return accessible
}

const walkAndRemove = (grid) => {
  let removed = 0
  while (true) {
    const accessible = walk(grid)
    if (accessible.length == 0) { return removed }
    accessible.forEach(([r,c]) => grid[r][c] = ".")
    removed += accessible.length
  }
}

const part1 = walk(grid).length
const part2 = walkAndRemove(grid)

console.log("part 1:", part1);
console.log("part 2:", part2);
