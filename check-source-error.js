/**
 * Browser Console Script to Check Source Error Details
 * 
 * Instructions:
 * 1. Navigate to: http://localhost:3000/dashboard/bots/cml6k3huez9johs1t1qmy03o/setup
 * 2. Open browser console (F12)
 * 3. Copy and paste this script
 * 4. Press Enter
 */

async function checkSourceError() {
  const botId = 'cml6k3huez9johs1t1qmy03o';
  
  console.log("🔍 Checking source error details...\n");
  
  try {
    const response = await fetch(`/api/bots/${botId}`);
    const bot = await response.json();
    
    console.log("Bot:", bot.name);
    console.log("Sources:", bot.source?.length || 0);
    console.log("\nSource Details:");
    
    if (bot.source && bot.source.length > 0) {
      bot.source.forEach((s, i) => {
        console.log(`\n${i + 1}. Source ID: ${s.id}`);
        console.log(`   Type: ${s.type}`);
        console.log(`   Title: ${s.title || 'N/A'}`);
        console.log(`   URL: ${s.url || s.documentUrl || 'N/A'}`);
        console.log(`   Status: ${s.status}`);
        if (s.error) {
          console.log(`   ❌ Error: ${s.error}`);
        }
        console.log(`   Page Count: ${s.pageCount || 0}`);
      });
      
      const failedSources = bot.source.filter(s => s.status === 'failed');
      if (failedSources.length > 0) {
        console.log("\n⚠️  Failed Sources Found:");
        failedSources.forEach(s => {
          console.log(`   - ${s.title || s.url || s.id}: ${s.error || 'Unknown error'}`);
        });
        
        console.log("\n💡 To retry training:");
        console.log("   1. Click 'Retry training' button on the page");
        console.log("   2. Or run: await fetch(`/api/bots/${botId}/train`, { method: 'POST', body: JSON.stringify({ stream: true }) })");
      }
    } else {
      console.log("No sources found.");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkSourceError();
