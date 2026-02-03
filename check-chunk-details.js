// Check chunk details for a bot
// Run this in browser console on http://localhost:3000/dashboard

const botId = 'cml6krnpksk747j46phou0o1'; // Replace with your bot ID

console.log('Checking chunk details for bot:', botId);

// Get bot details
fetch(`/api/bots/${botId}`)
  .then(r => r.json())
  .then(bot => {
    console.log('\n=== Bot Information ===');
    console.log('Bot Name:', bot.name);
    console.log('Total Chunks:', bot._count?.chunk || 0);
    console.log('Total Sources:', bot.source?.length || 0);
    
    console.log('\n=== Sources ===');
    bot.source?.forEach((s, i) => {
      console.log(`\nSource ${i + 1}:`);
      console.log('  Type:', s.type);
      console.log('  Title:', s.title || 'N/A');
      console.log('  URL:', s.url || s.documentUrl || 'N/A');
      console.log('  Status:', s.status);
      if (s.error) console.log('  Error:', s.error);
    });
    
    // Check chunk details via API
    console.log('\n=== Checking Chunk Details ===');
    return fetch(`/api/bots/${botId}/analytics`)
      .then(r => r.json())
      .then(analytics => {
        console.log('\nAnalytics:', analytics);
        
        if (analytics.sourcesUsed) {
          console.log('\n=== Chunks per Source ===');
          analytics.sourcesUsed.forEach(s => {
            console.log(`${s.title || s.url || 'Unknown'}: ${s.chunkCount} chunks`);
          });
        }
        
        // Provide assessment
        console.log('\n=== Assessment ===');
        const totalChunks = bot._count?.chunk || 0;
        const totalSources = bot.source?.length || 0;
        
        if (totalChunks === 0) {
          console.warn('❌ No chunks found! Bot needs training.');
        } else if (totalChunks === 1) {
          console.warn('⚠️ Only 1 chunk - Very minimal content. Bot may not have enough knowledge.');
        } else if (totalChunks === 2) {
          console.warn('⚠️ Only 2 chunks - Low content. Consider:');
          console.warn('  1. Add more pages/URLs to the source');
          console.warn('  2. Check if website crawling worked correctly');
          console.warn('  3. Verify the source has substantial content');
        } else if (totalChunks < 10) {
          console.log('⚠️ Low chunk count (< 10). Bot may have limited knowledge.');
          console.log('  Consider adding more sources or pages.');
        } else if (totalChunks < 50) {
          console.log('✅ Moderate chunk count. Bot should work but more content helps.');
        } else {
          console.log('✅ Good chunk count! Bot has substantial knowledge.');
        }
        
        console.log('\n=== Recommendations ===');
        if (totalChunks < 10) {
          console.log('1. Add more website URLs');
          console.log('2. Upload documents (PDF, DOCX, TXT, MD)');
          console.log('3. Check if sources were crawled successfully');
          console.log('4. Verify source content is substantial');
        }
      });
  })
  .catch(err => {
    console.error('Error:', err);
  });
