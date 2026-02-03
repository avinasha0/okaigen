const fs = require('fs');
const path = require('path');

// Prisma Client generates camelCase properties from PascalCase models
// Model Plan -> prisma.plan (not prisma.Plan)
const modelMappings = {
  'Account': 'account',
  'AccountMember': 'accountMember',
  'ApiKey': 'apiKey',
  'Bot': 'bot',
  'Chat': 'chat',
  'ChatMessage': 'chatMessage',
  'Chunk': 'chunk',
  'ContactSubmission': 'contactSubmission',
  'Embedding': 'embedding',
  'Lead': 'lead',
  'Plan': 'plan',
  'Session': 'session',
  'Source': 'source',
  'TeamInvitation': 'teamInvitation',
  'UsageLog': 'usageLog',
  'User': 'user',
  'UserPlan': 'userPlan',
  'VerificationToken': 'verificationToken',
  'Webhook': 'webhook',
};

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
  const originalContent = content;

  // Replace prisma.ModelName with prisma.modelName (camelCase)
  for (const [pascal, camel] of Object.entries(modelMappings)) {
    const regex = new RegExp(`prisma\\.${pascal}\\b`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `prisma.${camel}`);
    }
  }

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
    if (fs.existsSync(file) && fixFile(file)) {
      fixedCount++;
    }
  }

  console.log(`\nFixed ${fixedCount} files to use camelCase Prisma properties`);
}

main();
