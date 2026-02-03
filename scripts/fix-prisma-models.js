const fs = require('fs');
const path = require('path');

// Model name mappings: lowercase -> PascalCase
const modelMappings = {
  'account': 'Account',
  'accountmember': 'AccountMember',
  'apikey': 'ApiKey',
  'bot': 'Bot',
  'chat': 'Chat',
  'chatmessage': 'ChatMessage',
  'chunk': 'Chunk',
  'contactsubmission': 'ContactSubmission',
  'embedding': 'Embedding',
  'lead': 'Lead',
  'plan': 'Plan',
  'session': 'Session',
  'source': 'Source',
  'teaminvitation': 'TeamInvitation',
  'usagelog': 'UsageLog',
  'user': 'User',
  'userplan': 'UserPlan',
  'verificationtoken': 'VerificationToken',
  'webhook': 'Webhook',
};

// Recursive glob function
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

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [lower, pascal] of Object.entries(modelMappings)) {
    const regex = new RegExp(`prisma\\.${lower}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `prisma.${pascal}`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function main() {
  const tsFiles = findFiles('src', '.ts');
  const tsxFiles = findFiles('src', '.tsx');
  const files = [...tsFiles, ...tsxFiles];
  let fixedCount = 0;

  for (const file of files) {
    if (fixFile(file)) {
      fixedCount++;
    }
  }

  console.log(`\nFixed ${fixedCount} files`);
}

main();
