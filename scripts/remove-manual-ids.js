const fs = require('fs');
const path = require('path');

function findFiles(dir, ext, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      findFiles(filePath, ext, fileList);
    } else if (file.endsWith(ext)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function removeManualIds(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Pattern 1: data: { id: generateId(), ... } - remove id line
  content = content.replace(/data:\s*{\s*id:\s*generateId\(\),\s*/g, 'data: {');
  
  // Pattern 2: data: { id: generateId(), (with newline after)
  content = content.replace(/data:\s*{\s*id:\s*generateId\(\),\s*\n\s*/g, 'data: {\n');
  
  // Pattern 3: Standalone id: generateId(), line (with proper indentation)
  content = content.replace(/^\s+id:\s*generateId\(\),\s*$/gm, '');
  
  // Pattern 4: id: generateId(), followed by comma and new field
  content = content.replace(/,\s*id:\s*generateId\(\),\s*/g, ', ');
  content = content.replace(/id:\s*generateId\(\),\s*/g, '');
  
  // Pattern 5: Fix double commas that might result
  content = content.replace(/,\s*,/g, ',');
  content = content.replace(/{\s*,/g, '{');
  content = content.replace(/,\s*}/g, '}');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function main() {
  const tsFiles = findFiles('src', '.ts');
  const tsxFiles = findFiles('src', '.tsx');
  const seedFile = 'prisma/seed.ts';
  const files = [...tsFiles, ...tsxFiles, seedFile];
  let fixedCount = 0;

  for (const file of files) {
    if (fs.existsSync(file) && removeManualIds(file)) {
      fixedCount++;
    }
  }

  console.log(`\nRemoved manual IDs from ${fixedCount} files`);
}

main();
