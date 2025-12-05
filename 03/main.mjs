import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s);

const input = readLines("input.txt");

const range  = (s1,s2) => {
  var x = parseInt(s1);
  var y = parseInt(s2);
  var r = [];
  while (x <= y) {
    r.push(x++);
  }
  return r;
}

const log = s => console.log(s);

const maxDigit = (s,x) => {
  var val = "0"
  var index = 0
  var n = 0
  while (n < s.length - x + 1) {
    if (s[n] > val) {
      val = s[n]
      index = n
    }
    n++
  }
  return {val, index}
}

const int = s => parseInt(s,10)

const findMax0 = (str, {indices, max}, nextIndex) => {
  //console.log("findMax0", str, indices, max, nextIndex);
  var new_max = max
  var new_max_indices = indices
  for (var i=1; i<indices.length; i++) {
    var new_indices = []
    var new_num = []
    for (var j=0; j<indices.length; j++) {
      // console.log("i=", i,"j=",j)
      if (i != j) {
        const n = indices[j]
        new_indices.push(n)
        new_num.push(str[n])
      }
    }
    new_num.push(str[nextIndex])
    new_indices.push(nextIndex)
    //console.log("new_num", new_num, "new_ind", new_indices, "max", new_max);
    if (new_num > new_max) {
      new_max = new_num
      new_max_indices = new_indices
    }
  }
  return {max:new_max, indices:new_max_indices}
}

const findMax = (s,n) => {
  const {index} = maxDigit(s,n)
  const r = range(index,index+n-1)
  var max = r.map(x=>s[x])
  //console.log(r,max);
  const nextIndex = index + n
  const lastIndex = s.length - 1
  const accum = {str:s, indices:r, max}
  var {max:new_max} = range(nextIndex, lastIndex).reduce((accum, index) => findMax0(s, accum, index), accum)
  return parseInt(new_max.join(''))
}

const maxJoltage1 = s => findMax(s, 2)
const maxJoltage2 = s => findMax(s, 12)

const sum = (a,b) => a+b

const part1 = input.map(maxJoltage1).reduce(sum)
const part2 = input.map(maxJoltage2).reduce(sum)

console.log("part 1:", part1);
console.log("part 2:", part2);




