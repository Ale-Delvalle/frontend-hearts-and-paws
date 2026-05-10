const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('C:/Users/ozono/Desktop/h-n-p/front/src');

let count = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('#800000')) {
    const newContent = content.replace(/#800000/gi, '#FA8072');
    fs.writeFileSync(file, newContent);
    console.log(`Updated: ${file}`);
    count++;
  }
});
console.log(`Replaced in ${count} files.`);
