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

const Point = ([x,y]) => ({x,y})

const inputFile = "input.txt"

const points = readLines(inputFile).filter(s=>s).map(s=>s.split(",").map(s=>parseInt(s))).map(Point)

const xy = ({x,y}) => `(${x},${y})`

const maxes = points.reduce((acc, {x,y}) => ({x: Math.max(x, acc.x), y: Math.max(y, acc.y) }), {x:0,y:0})
const mins = points.reduce((acc, {x,y}) => ({x: Math.min(x, acc.x), y: Math.min(y, acc.y) }), maxes)

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

const maxArea = pairs[0].area

const isVertical = line => line[0].x == line[1].x

const edges = []
const verticalEdges = []

for (var i=0; i<points.length; i++) {
  const j = i + 1
  const n = j >= points.length ? 0 : j
  const line =[points[i], points[n]] 
  edges.push(line)
  if (isVertical(line)) { verticalEdges.push(line) }
}

const rect = (a,b) => [{x:a.x,y:a.y},{x:a.x,y:b.y},{x:b.x,y:a.y},{x:b.x,y:b.y}]

const between = (n, x, y) => {
  const result = Math.min(x,y) <= n && n <= Math.max(x,y)
  // if (!(Number.isInteger(n) && Number.isInteger(x) && Number.isInteger(y))) {
    // console.log("between n", n, "x", x, "y", y, result)
  // }
  return result
}

const isPointOnEdge = (point, line) => {
  const result = between(point.x, line[0].x, line[1].x) && between(point.y, line[0].y, line[1].y)
  if (result) {
    //console.log("isPointOnEdge, point", xy(point), "line", line.map(xy), "result", result)
  }
  return result
}

const isPointOnBoundary = point => edges.find(line => isPointOnEdge(point, line))

const isPointInPolygon = (point) => {
  //console.log("isPointInPolygon", point)

  if (isPointOnBoundary(point)) {
    return true
  }

  const ray = [{x:0, y:point.y}, {x: point.x, y: point.y}]

  var above = 0
  var below = 0

  verticalEdges.filter(edge=>edge[0].x <= point.x).forEach(edge => {
      const pointAbove = {x: edge[0].x, y:(point.y - 0.5)}
      const pointBelow = {x: edge[0].x, y:(point.y + 0.5)}
      //console.log("pointAbove", pointAbove, "pointBelow", pointBelow, "edge", edge, "ray", ray)
      if (isPointOnEdge(pointAbove, edge)) { 
        //console.log("above matches")
        above++
      }
      if (isPointOnEdge(pointBelow, edge)) {
        //console.log("below matches")
        below++
      }
    })
  //console.log("above", above, "below", below)
  return above % 2 == 1 || below % 2 == 1
}

points.forEach(point => 
  assertEqual(2, edges.filter(line => isPointOnEdge(point, line)).length)
)

const part1 = maxArea;

console.log("part 1:", pairs[0], part1);

const isRectInPolygon = (v0,v1) => {
  const otherCorners = [{x:v0.x,y:v1.y},{x:v1.x,y:v0.y}]
  for (const p of otherCorners) {
    if (!isPointInPolygon(p)) {
      return false
    }
  }
  // all 4 points are inside the polygon

  // calc 2 horizontal inner rays:  one just above the bottom of the rect and another just below the top
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

  // now make sure all points just inside the rectangle are inside the polygon
  for (const p of innerPoints) {
    if (!isPointInPolygon(p)) {
      return false
    }
  }
  
  // finally make sure there are no vertical edges that cross the inner rays
  
  for (const edge of verticalEdges) {
    // upper ray
    if (between(edge[0].x, innerPoints[0].x, innerPoints[1].x) && between(innerPoints[0].y, edge[0].y, edge[1].y)) {
      return false;
    }
    // lower ray
    if (between(edge[0].x, innerPoints[2].x, innerPoints[3].x) && between(innerPoints[2].y, edge[0].y, edge[1].y)) {
      return false;
    }
  }

  return true
}

/*
console.log("isRectInPolygon", isRectInPolygon(rect({x:2,y:5},{x:7,y:3})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:2,y:3},{x:9,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:9,y:5},{x:2,y:3})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:9,y:5},{x:11,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:11,y:7},{x:9,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:9,y:5},{x:7,y:1})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:2,y:3},{x:7,y:3})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:2,y:3},{x:2,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:11,y:1},{x:9,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:11,y:1},{x:7,y:3})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:9,y:5},{x:7,y:3})))
console.log("-------------")
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:1},{x:2,y:3})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:1},{x:2,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:2,y:5},{x:9,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:2,y:3},{x:9,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:3},{x:9,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:4,y:1},{x:10,y:3})))




console.log("isRectInPolygon", isRectInPolygon(rect({x:5,y:1},{x:10,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:5,y:1},{x:12,y:3})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:5,y:3},{x:12,y:1})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:3,y:3},{x:5,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:3,y:3},{x:10,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:8},{x:9,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:10,y:5},{x:9,y:7})))
console.log("-------------")
console.log("isRectInPolygon", isRectInPolygon(rect({x:3,y:3},{x:13,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:3,y:3},{x:13,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:5,y:1},{x:13,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:8},{x:10,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:5,y:3},{x:9,y:7})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:8},{x:13,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:7,y:8},{x:10,y:5})))
console.log("isRectInPolygon", isRectInPolygon(rect({x:3,y:7},{x:12,y:1})))

console.log("isRectInPolygon", isRectInPolygon(rect({x:3,y:7},{x:10,y:3})))

console.log("isPointInPolygon 4,1", isPointInPolygon({x:4,y:1}))
console.log("isPointInPolygon 13,1", isPointInPolygon({x:13,y:1}))
console.log("-------------")
console.log("isPointInPolygon 10,7", isPointInPolygon({x:10,y:7}))
console.log("isPointInPolygon 10,4", isPointInPolygon({x:10,y:4}))
console.log("isPointInPolygon 12,2", isPointInPolygon({x:12,y:2}))
console.log("isPointInPolygon 13,6", isPointInPolygon({x:13,y:6}))
console.log("isPointInPolygon 4,4", isPointInPolygon({x:4,y:4}))
console.log("isPointInPolygon 5,4", isPointInPolygon({x:5,y:4}))
*/

//console.log("isPointInPolygon 13,1", isPointInPolygon({x:13,y:1}))
//console.log("isPointInPolygon 8,8", isPointInPolygon({x:8,y:8}))
//console.log("isPointInPolygon 8,5", isPointInPolygon({x:8,y:5}))
//console.log("isPointInPolygon 6,6", isPointInPolygon({x:6,y:6}))
//console.log("isPointInPolygon 4,6", isPointInPolygon({x:4,y:6}))
//

const callIsRectInPolygon = (p0, p1) => console.log("isRectInPolygon", xy(p0), xy(p1), isRectInPolygon(p0, p1))

// console.log("------------- should be true")
// callIsRectInPolygon({x:3,y:3},{x:5,y:3})
// callIsRectInPolygon({x:5,y:3},{x:7,y:5})
// callIsRectInPolygon({x:5,y:1},{x:10,y:5})
// callIsRectInPolygon({x:5,y:1},{x:12,y:3})
// callIsRectInPolygon({x:5,y:5},{x:9,y:7})
// console.log("------------- should be false")
// callIsRectInPolygon({x:5,y:1},{x:13,y:5})
// callIsRectInPolygon({x:5,y:1},{x:7,y:8})
// callIsRectInPolygon({x:13,y:5},{x:7,y:8})
// callIsRectInPolygon({x:13,y:5},{x:5,y:3})
// callIsRectInPolygon({x:13,y:7},{x:7,y:8})
// callIsRectInPolygon({x:12,y:1},{x:7,y:8})
// callIsRectInPolygon({x:10,y:5},{x:7,y:8})
// callIsRectInPolygon({x:13,y:5},{x:10,y:3})
// callIsRectInPolygon({x:3,y:3},{x:9,y:8})
// console.log("------------- should be false but are true for now")
// callIsRectInPolygon({x:5,y:7},{x:7,y:5})
// callIsRectInPolygon({x:5,y:5},{x:12,y:3})
// callIsRectInPolygon({x:5,y:5},{x:12,y:1})
// callIsRectInPolygon({x:3,y:3},{x:9,y:7})
// callIsRectInPolygon({x:3,y:7},{x:10,y:5})


const pair = pairs.find(({p0,p1})=> isRectInPolygon(p0, p1))
const part2 = pair?.area || -1
console.log("part 2:", pair, part2);

