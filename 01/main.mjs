import * as fs from 'fs';

const readLines = fileName => fs.readFileSync(fileName, "utf-8").split("\n").filter(s=>s);

const input = readLines("input.txt");

const solve = (input, isPart2) => {
  var password = 0;
  var pos = 50;
  input.forEach(s => {
    const n = parseInt(s.substring(1))
    const clicks = n % 100;
    const fullTurns = Math.trunc(n / 100);
    const prev = pos;
    if (s[0] === 'R')  pos += clicks; else pos -= clicks;

    if (pos < 0) {
      pos += 100
      if (isPart2) { 
        if (prev > 0 && pos !== 0) password++;
      }
    }
    else if (pos > 99) {
      pos -= 100
      if (isPart2) { 
        if (pos !== 0) password++;
      }
    }
    if (isPart2) { 
      password += fullTurns;
    }

    if (pos === 0) password++;
  });

  return password;
}

var part1 = solve(input, false);
var part2 = solve(input, true);

console.log("part 1:", part1);
console.log("part 2:", part2);
