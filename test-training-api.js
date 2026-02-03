/**
 * Browser Console Test Script for Bot Training API
 * 
 * Instructions:
 * 1. Make sure you're logged into the dashboard
 * 2. Navigate to: http://localhost:3000/dashboard/bots/cml6k3huez9johs1t1qmy03o/setup
 * 3. Open browser console (F12)
 * 4. Copy and paste this entire script into the console
 * 5. Press Enter to run
 */

async function testBotTraining() {
  const botId = 'cml6k3huez9johs1t1qmy03o';
  console.log("🧪 Testing Bot Training API...\n");
  console.log(`Bot ID: ${botId}\n`);

  // Step 1: Check bot status
  console.log("Step 1: Checking bot status...");
  try {
    const botResponse = await fetch(`/api/bots/${botId}`);
    const bot = await botResponse.json();
    console.log('✅ Bot found:', bot.name);
    console.log('   Sources:', bot.source?.length || 0);
    console.log('   Pending sources:', bot.source?.filter(s => s.status === 'pending').length || 0);
    console.log('   Failed sources:', bot.source?.filter(s => s.status === 'failed').length || 0);
    console.log('   Completed sources:', bot.source?.filter(s => s.status === 'completed').length || 0);
    console.log('   Total chunks:', bot._count?.chunk || 0);
    
    if (!bot.source || bot.source.length === 0) {
      console.log('\n⚠️  No sources found. Add a source first before training.');
      return;
    }
    
    const pendingSources = bot.source.filter(s => s.status === 'pending');
    const failedSources = bot.source.filter(s => s.status === 'failed');
    
    if (pendingSources.length === 0 && failedSources.length === 0) {
      console.log('\n⚠️  No pending or failed sources to train.');
      return;
    }
  } catch (error) {
    console.error('❌ Failed to fetch bot:', error);
    return;
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Step 2: Test training with streaming
  console.log("Step 2: Starting training with streaming...");
  try {
    const response = await fetch(`/api/bots/${botId}/train`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream: true }),
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Training failed:', errorData);
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    const isStream = contentType.includes('application/x-ndjson');

    if (isStream && response.body) {
      console.log('✅ Streaming response detected\n');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let eventCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('\n✅ Stream completed');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            eventCount++;
            
            switch (event.type) {
              case 'init':
                console.log(`[${eventCount}] 🚀 ${event.message || 'Initializing...'}`);
                break;
              case 'pages_discovered':
                console.log(`[${eventCount}] 📄 Pages discovered: ${event.count}`);
                if (event.pages && event.pages.length > 0) {
                  event.pages.forEach((p, i) => {
                    console.log(`      ${i + 1}. ${p.title || p.url}`);
                  });
                }
                break;
              case 'page':
                const statusEmoji = event.status === 'completed' ? '✅' : event.status === 'in_progress' ? '⏳' : '⏸️';
                console.log(`[${eventCount}] ${statusEmoji} Page: ${event.title || event.url} (${event.status})`);
                if (event.considered) {
                  console.log(`      Progress: ${event.completed || 0}/${event.considered} completed, ${event.inProgress || 0} in progress, ${event.pending || 0} pending`);
                }
                break;
              case 'done':
                console.log(`[${eventCount}] ✅ Training completed!`);
                console.log(`      Chunks created: ${event.chunksCreated || 0}`);
                console.log(`      Pages indexed: ${event.pagesIndexed || 0}`);
                break;
              case 'error':
                console.error(`[${eventCount}] ❌ Error: ${event.error || 'Unknown error'}`);
                if (event.detail) {
                  console.error(`      Detail: ${event.detail}`);
                }
                break;
              default:
                console.log(`[${eventCount}] 📦 Event: ${event.type}`, event);
            }
          } catch (parseErr) {
            console.warn('⚠️  Failed to parse event:', line);
          }
        }
      }
    } else {
      // Non-streaming response
      const data = await response.json();
      console.log('✅ Training completed (non-streaming)');
      console.log('Response:', data);
    }

    // Step 3: Verify results
    console.log('\n' + '='.repeat(50) + '\n');
    console.log("Step 3: Verifying training results...");
    const verifyResponse = await fetch(`/api/bots/${botId}`);
    const verifyBot = await verifyResponse.json();
    console.log('   Total chunks:', verifyBot._count?.chunk || 0);
    console.log('   Sources status:', verifyBot.source?.map(s => `${s.title || s.type}: ${s.status}`).join(', ') || 'none');
    
  } catch (error) {
    console.error('❌ Training error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Test completed!');
}

// Run the test
testBotTraining();
