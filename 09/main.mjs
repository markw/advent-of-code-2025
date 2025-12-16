import * as fs from 'fs';

const assertEqual = (expected, actual, label) => {
  const s = label || "assertion failed"
  if (expected != actual) {
    throw new Error(`${s}: expected ${expected}, got ${actual}`)
  }
}

const assert = (condition,label) => {
  const s = label || ""
  if (!condition) {
    throw new Error(`assertion failed: ${s}`)
  }
}

const assertFalse = (condition,label) => assert(!condition, label)

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n")

const inputFile = "input.txt"

const points = readLines(inputFile).filter(s=>s).map(s=>s.split(",").map(s=>parseInt(s))).map(([x,y]) => ({x,y}))

const xy = ({x,y}) => `(${x},${y})`

const calcArea = (a,b) => (Math.abs(a.x-b.x) + 1) * (Math.abs(a.y-b.y) + 1)

const pairs = []
for (var i=0; i<points.length; i++) {
  for (var j=i+1; j<points.length; j++) {
    const p0 = points[i]
    const p1 = points[j]
    const area = calcArea(p0,p1)
    pairs.push({p0, p1, area})
  }
}

pairs.sort((a,b) => a.area < b.area ? 1 : a.area > b.area ? -1 : 0)

// -----------------------------------------------------------
// part 1
// -----------------------------------------------------------

const part1 = pairs[0].area

console.log("part 1:", part1);

// -----------------------------------------------------------
// part 2
// -----------------------------------------------------------

const isVertical = edge => edge[0].x == edge[1].x

const edges = []
const verticalEdges = []
const horizontalEdges = []

for (var i=0; i<points.length; i++) {
  const j = i + 1
  const n = j >= points.length ? 0 : j
  const edge =[points[i], points[n]] 
  edges.push(edge)
  if (isVertical(edge)) { verticalEdges.push(edge) } else { horizontalEdges.push(edge) }
}

const between = (n, x, y) => Math.min(x,y) <= n && n <= Math.max(x,y)

const isPointOnEdge = (point, edge) => between(point.x, edge[0].x, edge[1].x) && between(point.y, edge[0].y, edge[1].y)

const isPointOnBoundary = point => edges.find(edge => isPointOnEdge(point, edge))

const isPointInPolygon = (point) => {

  if (isPointOnBoundary(point)) {
    return true
  }

  let above = 0, below = 0

  verticalEdges.filter(edge=>edge[0].x <= point.x).forEach(edge => {
      const pointAbove = {x: edge[0].x, y:(point.y - 0.5)}
      const pointBelow = {x: edge[0].x, y:(point.y + 0.5)}

      if (isPointOnEdge(pointAbove, edge)) { above++ }
      if (isPointOnEdge(pointBelow, edge)) { below++ }
    })
  return above % 2 == 1 || below % 2 == 1
}

points.forEach(point => 
  assertEqual(2, edges.filter(line => isPointOnEdge(point, line)).length)
)

const isRectInPolygon = (v0,v1) => {
  const otherCorners = [{x:v0.x,y:v1.y},{x:v1.x,y:v0.y}]
  for (const p of otherCorners) {
    if (!isPointInPolygon(p)) {
      return false
    }
  }
  // all 4 points are inside the polygon

  // calc 2 horizontal inner rays:  one just above the bottom of the rect and another just below the top
  // calc 2 vertical inner rays:  one just right of the left vertical edge of the rect and another just left of the right vertical edge
  const ps = [v0,v1].concat(otherCorners)
  const minX = Math.min(...ps.map(e=>e.x))
  const maxX = Math.max(...ps.map(e=>e.x))
  const minY = Math.min(...ps.map(e=>e.y))
  const maxY = Math.max(...ps.map(e=>e.y))

  const innerPoints = [ 
    {x: minX + 0.5, y: minY + 0.5},
    {x: maxX - 0.5, y: minY + 0.5}, 
    {x: minX + 0.5, y: maxY - 0.5}, 
    {x: maxX - 0.5, y: maxY - 0.5}, 
  ]

  // console.log("innerPoints", xy(v0), xy(v1), innerPoints)

  // make sure all points just inside the rectangle are inside the polygon
  for (const p of innerPoints) {
    if (!isPointInPolygon(p)) {
      return false
    }
  }
  
  // make sure there are no vertical edges that cross the horizontal inner rays
  //    edge
  //      |
  //      |
  // -----+------ ray
  //      |
  //      |
  
  const upperRay =  [ innerPoints[0], innerPoints[1] ]
  const lowerRay =  [ innerPoints[2], innerPoints[3] ]

  for (const edge of verticalEdges) {
    // upper ray
    if (between(edge[0].x, upperRay[0].x, upperRay[1].x) && between(upperRay[0].y, edge[0].y, edge[1].y)) {
      return false;
    }
    // lower ray
    if (between(edge[0].x, lowerRay[0].x, lowerRay[1].x) && between(lowerRay[0].y, edge[0].y, edge[1].y)) {
      return false;
    }


  }

  // make sure there are no horizontal edges that cross the vertical inner rays
  //     ray
  //      |
  //      |
  // -----+------ edge
  //      |
  //      |

  const leftRay =  [ innerPoints[0], innerPoints[2] ]
  const rightRay = [ innerPoints[1], innerPoints[3] ]

  for (const edge of horizontalEdges) {
    // left ray
    if (between(leftRay[0].x, edge[0].x, edge[1].x) && between(edge[0].y, leftRay[0].y, leftRay[1].y)) {
      return false;
    }
    // right ray
    if (between(rightRay[0].x, edge[0].x, edge[1].x) && between(edge[0].y, rightRay[0].y, rightRay[1].y)) {
      return false;
    }
  }

  return true
}

const pair = pairs.find(({p0,p1})=> isRectInPolygon(p0, p1))
const part2 = pair?.area || -1
console.log("part 2:", part2); // 1525991432
