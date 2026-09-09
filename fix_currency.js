const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace literal '$' before numbers (e.g., $12.50, $3.4k, $3,410)
  content = content.replace(/\$([0-9.,kK]+)/g, 'Rs.$1');

  // Replace literal '$' before JSX expressions (e.g., >${item.price}<)
  content = content.replace(/>\$\{/g, '>Rs.{');

  // Replace literal '$' enclosed in tags (e.g., <Text>$</Text>)
  content = content.replace(/>\$</g, '>Rs.<');

  // Any loose '$' in strings (e.g., revenue: '$27.5')
  content = content.replace(/'\$([0-9.,kK]+)'/g, "'Rs.$1'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated currency in ${file.replace(srcDir, '')}`);
    changedFiles++;
  }
});

console.log(`Done. Updated ${changedFiles} files.`);
