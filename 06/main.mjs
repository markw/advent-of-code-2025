import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s)

const add = (a,b)=>a+b
const multiply = (a,b)=>a*b

const worksheet = readLines("input.txt")

const column = (input, n) => {
  const a = []
  for (let i=0; i<input.length; i++) {
    a.push(input[i][n])
  }
  return a
}

const solveProblem = problem => {
  const op = problem.at(-1)
  if (op == '*') {
    return problem.slice(0,-1).map(s=>parseInt(s)).reduce(multiply,1)
  }
  if (op == '+') {
    return problem.slice(0,-1).map(s=>parseInt(s)).reduce(add,0)
  }
}

const parseWorksheet1 = w => {
  let columns = []
  let lines = w.map(s=>s.trim().split(/ +/))
  for (let i=0; i < lines[0].length; i++) {
    columns.push(column(lines, i))
  }
  return columns
}

const parseWorksheet2 = w => {
  let columns = []
  let column = []
  let i = 0
  while (i < w[0].length) {
    let s = ""
    for(let r=0; r < w.length - 1; r++) {
      s += (w[r][i] || '')
    }
    if (s.trim() == "") {
      columns.push(column.reverse())
      column = []
    } else {
      column.push(s.trim())
    }
    i++
  }
  const ops =  w.at(-1).trim().split(/ +/)
  ops.forEach((op, n) => columns[n].push(op))
  return columns.reverse()
}

let part1 = parseWorksheet1(worksheet).map(solveProblem).reduce(add);
let part2 = parseWorksheet2(worksheet.map(s=>s+" ")).map(solveProblem).reduce(add);

const logAnswer = (label, actual, expected) => {
  const flag = actual == expected ? "ok" : "error"
  console.log(label, actual, expected, flag);
}

logAnswer("part 1:", part1, 5667835681547);
logAnswer("part 2:", part2, 9434900032651);

