import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s)

const input = readLines("input.txt")

const arraysEqual = (a,b) => a.every((e,i) => e === b[i])

const parseButton = s => {
  const a = s.indexOf('(')
  const b = s.indexOf(')')
  return s.slice(a+1,b-a).split(',').map(t=>parseInt(t));
}

const parseButtons = s => {
  const buttons = []
  var a = s.indexOf('(', 0)
  while (a > 0) {
    buttons.push(parseButton(s.substring(a)))
    var a = s.indexOf('(', a+1)
  }
  return buttons
}

const parseLine = s => {
  const a = s.indexOf('[')
  const b = s.indexOf(']')
  const target = [...s.slice(a+1,b-a)].map(ch=>ch=='#');
  // const lights = target.map(_=>false)
  const buttons = parseButtons(s)
  return { target, buttons }
}

function range(start, end) {
  const result = []
  result.length = end - start + 1
  let i = 0
  while (start <= end) result[i++] = start++
  return result
}

function choose(array, numToChoose) {

  const allCombos = []
  const combo = [];
  combo.length = numToChoose;

  function _choose(len, start) {
    if(len === 0) {
      allCombos.push(combo.slice())
      return;
    }
    for (let i = start; i <= array.length - len; i++) {
      combo[numToChoose - len] = array[i];
      _choose(len-1, i+1);
    }
  }

  _choose(numToChoose, 0);
  return allCombos
}

function minClicks({target, buttons}) {
  //console.log("minClicks", buttons, target)

  function press(button, lights) {
    //console.log("before press", button, lights)
    for (const b of button) lights[b] = !lights[b]
    //console.log("after press", button, lights)
  }

  const combos = range(1, buttons.length).flatMap(n => choose(buttons, n))
  //console.log("Combos", combos)

  const match = combos.find(buttons => {
    const lights = target.map(_ => false)
    for (const button of buttons) {
      press(button, lights)
    }
    if (arraysEqual(lights, target)) {
      //console.log("match found", buttons, "lights", lights, "target", target)
      return true
    }
    return false
  })
  return match?.length || 0
}

const machines = input.map(parseLine)
//console.log("machines", machines)
const part1 = machines.map(i => minClicks(i)).reduce((a,b)=>a+b,0)
const part2 = 2;

console.log("part 1:", part1)
console.log("part 2:", part2)

