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

const replacements = {
  '#c81e1e': '#FA8072',
  '#a11818': '#e87366',
  'bg-pink-50': 'bg-[#fff5f2]',
  'bg-pink-100': 'bg-[#ffece8]',
  'bg-pink-200': 'bg-[#ffcfc7]',
  'border-pink-200': 'border-[#ffcfc7]',
  'border-pink-300': 'border-[#ffbba5]',
  'bg-pink-600': 'bg-[#FA8072]',
  'hover:bg-pink-700': 'hover:bg-[#e87366]',
  'hover:bg-pink-100': 'hover:bg-[#ffece8]',
  'border-pink-400': 'border-[#FA8072]',
  'border-pink-500': 'border-[#e87366]',
  'text-pink-600': 'text-[#FA8072]',
  'hover:text-pink-200': 'hover:text-[#ffcfc7]',
  'bg-red-50': 'bg-[#fff5f2]',
  'hover:bg-red-50': 'hover:bg-[#fff5f2]',
  'bg-red-100': 'bg-[#ffece8]',
  'border-red-100': 'border-[#ffece8]',
  'border-red-200': 'border-[#ffcfc7]',
};

let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(replacements)) {
    // using global replace
    content = content.split(key).join(value);
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
    count++;
  }
});
console.log(`Replaced in ${count} files.`);
