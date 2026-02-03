/**
 * Browser Console Script to Check Pages/Chunks Count
 * 
 * Instructions:
 * 1. Navigate to: http://localhost:3000/dashboard/bots/cml6k3huez9johs1t1qmy03o
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 */

async function checkPagesCount() {
  const botId = 'cml6k3huez9johs1t1qmy03o';
  
  console.log("📊 Checking Pages/Chunks Count...\n");
  console.log("=".repeat(60));
  
  try {
    // Fetch bot details
    const response = await fetch(`/api/bots/${botId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const bot = await response.json();
    
    console.log(`\n🤖 Bot: ${bot.name}`);
    console.log(`   ID: ${bot.id}`);
    console.log(`   Created: ${new Date(bot.createdAt).toLocaleString()}`);
    console.log(`   Updated: ${new Date(bot.updatedAt).toLocaleString()}\n`);
    
    // Total chunks
    const totalChunks = bot._count?.chunk || 0;
    console.log("📄 CHUNKS (Text Segments):");
    console.log(`   Total Chunks: ${totalChunks.toLocaleString('en-US')}`);
    
    // Sources breakdown
    if (bot.source && bot.source.length > 0) {
      console.log("\n📚 SOURCES:");
      
      let totalPages = 0;
      const completedSources = bot.source.filter(s => s.status === 'completed');
      const pendingSources = bot.source.filter(s => s.status === 'pending');
      const failedSources = bot.source.filter(s => s.status === 'failed');
      const processingSources = bot.source.filter(s => s.status === 'processing');
      
      console.log(`   Total Sources: ${bot.source.length}`);
      console.log(`   ✅ Completed: ${completedSources.length}`);
      console.log(`   ⏳ Pending: ${pendingSources.length}`);
      console.log(`   🔄 Processing: ${processingSources.length}`);
      console.log(`   ❌ Failed: ${failedSources.length}\n`);
      
      console.log("📋 Source Details:");
      bot.source.forEach((source, index) => {
        const pageCount = source.pageCount || 0;
        totalPages += pageCount;
        
        const statusIcon = source.status === 'completed' ? '✅' : 
                          source.status === 'failed' ? '❌' : 
                          source.status === 'processing' ? '🔄' : '⏳';
        
        console.log(`\n   ${index + 1}. ${statusIcon} ${source.title || source.url || source.documentUrl || 'Untitled'}`);
        console.log(`      Type: ${source.type}`);
        console.log(`      Status: ${source.status}`);
        console.log(`      Pages Indexed: ${pageCount.toLocaleString('en-US')}`);
        if (source.url) {
          console.log(`      URL: ${source.url}`);
        }
        if (source.documentUrl) {
          console.log(`      Document: ${source.documentUrl}`);
        }
        if (source.lastRefreshedAt) {
          console.log(`      Last Refreshed: ${new Date(source.lastRefreshedAt).toLocaleString()}`);
        }
        if (source.error) {
          console.log(`      Error: ${source.error}`);
        }
      });
      
      console.log(`\n📊 SUMMARY:`);
      console.log(`   Total Pages Indexed: ${totalPages.toLocaleString('en-US')}`);
      console.log(`   Total Chunks Created: ${totalChunks.toLocaleString('en-US')}`);
      
      if (totalPages > 0 && totalChunks > 0) {
        const avgChunksPerPage = (totalChunks / totalPages).toFixed(2);
        console.log(`   Average Chunks per Page: ${avgChunksPerPage}`);
      }
      
      // Get detailed chunk count per source
      if (completedSources.length > 0) {
        console.log(`\n🔍 Fetching detailed chunk counts per source...`);
        try {
          const chunksResponse = await fetch(`/api/bots/${botId}/chats`);
          // Note: This might not exist, but we can try
        } catch {
          // Ignore if endpoint doesn't exist
        }
      }
      
    } else {
      console.log("\n⚠️  No sources found.");
      console.log("   Add sources and train your bot to start indexing pages.");
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("💡 Note: 'Chunks' are text segments created from pages.");
    console.log("   Each page is split into multiple chunks for better search.");
    
  } catch (error) {
    console.error("\n❌ Error fetching bot details:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
  }
}

// Run the function
checkPagesCount();
