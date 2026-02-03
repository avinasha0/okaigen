/**
 * Browser Console Script to View Detailed Source Error
 * 
 * Instructions:
 * 1. Navigate to: http://localhost:3000/dashboard/bots/cml6k3huez9johs1t1qmy03o/setup
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to see the error details
 */

async function viewSourceError() {
  const botId = 'cml6k3huez9johs1t1qmy03o';
  
  console.log("🔍 Fetching source error details...\n");
  console.log("=".repeat(60));
  
  try {
    // Fetch bot details with sources
    const response = await fetch(`/api/bots/${botId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const bot = await response.json();
    
    console.log(`\n📊 Bot: ${bot.name}`);
    console.log(`   ID: ${bot.id}`);
    console.log(`   Total Sources: ${bot.source?.length || 0}`);
    console.log(`   Total Chunks: ${bot._count?.chunk || 0}\n`);
    
    if (!bot.source || bot.source.length === 0) {
      console.log("⚠️  No sources found.");
      return;
    }
    
    // Find failed sources
    const failedSources = bot.source.filter(s => s.status === 'failed');
    const pendingSources = bot.source.filter(s => s.status === 'pending');
    const completedSources = bot.source.filter(s => s.status === 'completed');
    const processingSources = bot.source.filter(s => s.status === 'processing');
    
    console.log("📈 Source Status Summary:");
    console.log(`   ✅ Completed: ${completedSources.length}`);
    console.log(`   ⏳ Pending: ${pendingSources.length}`);
    console.log(`   🔄 Processing: ${processingSources.length}`);
    console.log(`   ❌ Failed: ${failedSources.length}\n`);
    
    if (failedSources.length > 0) {
      console.log("=".repeat(60));
      console.log("❌ FAILED SOURCES DETAILS:\n");
      
      failedSources.forEach((source, index) => {
        console.log(`${index + 1}. Source Details:`);
        console.log(`   ID: ${source.id}`);
        console.log(`   Type: ${source.type}`);
        console.log(`   Title: ${source.title || 'N/A'}`);
        console.log(`   URL: ${source.url || source.documentUrl || 'N/A'}`);
        console.log(`   Status: ${source.status}`);
        console.log(`   Page Count: ${source.pageCount || 0}`);
        
        if (source.error) {
          console.log(`\n   🔴 ERROR MESSAGE:`);
          console.log(`   ${source.error}`);
          console.log(`\n   Error Details:`);
          
          // Try to parse if it's JSON
          try {
            const errorObj = JSON.parse(source.error);
            console.log(JSON.stringify(errorObj, null, 2));
          } catch {
            // Not JSON, display as-is
            console.log(`   ${source.error}`);
          }
        } else {
          console.log(`\n   ⚠️  No error message stored in database.`);
        }
        
        console.log("\n" + "-".repeat(60) + "\n");
      });
      
      console.log("=".repeat(60));
      console.log("\n💡 Next Steps:");
      console.log("   1. Check server logs for detailed error stack traces");
      console.log("   2. Verify the URL is accessible: " + (failedSources[0].url || failedSources[0].documentUrl || 'N/A'));
      console.log("   3. Click 'Retry training' button to attempt again");
      console.log("   4. If URL is invalid, delete and add a new source with correct URL");
      
      console.log("\n🔧 To retry training, run:");
      console.log(`   fetch('/api/bots/${botId}/train', {`);
      console.log(`     method: 'POST',`);
      console.log(`     headers: { 'Content-Type': 'application/json' },`);
      console.log(`     body: JSON.stringify({ stream: true })`);
      console.log(`   }).then(r => r.json()).then(console.log).catch(console.error);`);
      
    } else {
      console.log("✅ No failed sources found!");
      
      if (pendingSources.length > 0) {
        console.log(`\n⏳ ${pendingSources.length} source(s) pending training.`);
        console.log("   Click 'Start training' button to begin.");
      }
    }
    
    // Show all sources for reference
    console.log("\n" + "=".repeat(60));
    console.log("📋 ALL SOURCES:");
    bot.source.forEach((s, i) => {
      const statusIcon = s.status === 'completed' ? '✅' : 
                        s.status === 'failed' ? '❌' : 
                        s.status === 'processing' ? '🔄' : '⏳';
      console.log(`${i + 1}. ${statusIcon} ${s.title || s.url || s.documentUrl || s.id} (${s.status})`);
      if (s.error) {
        console.log(`   Error: ${s.error.substring(0, 100)}${s.error.length > 100 ? '...' : ''}`);
      }
    });
    
  } catch (error) {
    console.error("\n❌ Error fetching source details:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
  }
}

// Run the function
viewSourceError();
