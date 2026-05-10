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
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const loginFiles = walk('C:/Users/ozono/Desktop/h-n-p/front/src/app/login');
const registerFiles = walk('C:/Users/ozono/Desktop/h-n-p/front/src/app/register');
const formFiles = walk('C:/Users/ozono/Desktop/h-n-p/front/src/components/forms');
const files = [...loginFiles, ...registerFiles, ...formFiles];

let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Add dark:bg-black to main backgrounds if missing
  content = content.replace(/bg-\[\#fff5f2\](?!.*dark:bg-black)/g, 'bg-[#fff5f2] dark:bg-black');
  
  // Add dark mode to form cards
  content = content.replace(/bg-white(?=.*border-\[\#ffbba5\])(?!.*dark:bg-zinc-900)/g, 'bg-white dark:bg-zinc-900');
  content = content.replace(/border-\[\#ffbba5\](?!.*dark:border-zinc-800)/g, 'border-[#ffbba5] dark:border-zinc-800');
  
  // Add dark mode to texts in forms
  content = content.replace(/text-gray-700(?!.*dark:text-gray-300)/g, 'text-gray-700 dark:text-gray-300');
  content = content.replace(/text-gray-600(?!.*dark:text-gray-300)/g, 'text-gray-600 dark:text-gray-300');
  
  // Add dark mode to inputs
  content = content.replace(/border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500(?!.*dark:bg-zinc-800)/g, 'border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-pink-500');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
    count++;
  }
});
console.log(`Replaced in ${count} files.`);
