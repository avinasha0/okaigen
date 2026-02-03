/**
 * Browser Console Test Script for Bot Creation API
 * 
 * Instructions:
 * 1. Start your dev server: npm run dev
 * 2. Login to the dashboard at http://localhost:3000/dashboard
 * 3. Open browser console (F12)
 * 4. Copy and paste this entire script into the console
 * 5. Press Enter to run
 */

async function testBotCreation() {
  console.log("🧪 Testing Bot Creation API...\n");

  // Test 1: Create bot without website URL
  console.log("Test 1: Creating bot without website URL");
  try {
    const response1 = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Bot ' + Date.now()
      })
    });
    
    const result1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', result1);
    
    if (response1.ok) {
      console.log('✅ Test 1 PASSED: Bot created successfully');
      console.log('Bot ID:', result1.id);
      console.log('Bot Name:', result1.name);
      console.log('Public Key:', result1.publicKey);
    } else {
      console.log('❌ Test 1 FAILED:', result1.error);
    }
  } catch (error) {
    console.error('❌ Test 1 ERROR:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Create bot with website URL
  console.log("Test 2: Creating bot with website URL");
  try {
    const response2 = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Bot with URL ' + Date.now(),
        websiteUrl: 'http://localhost:3000/'
      })
    });
    
    const result2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', result2);
    
    if (response2.ok) {
      console.log('✅ Test 2 PASSED: Bot with URL created successfully');
      console.log('Bot ID:', result2.id);
      console.log('Bot Name:', result2.name);
      console.log('Sources:', result2.source?.length || 0);
      if (result2.source && result2.source.length > 0) {
        console.log('Source URL:', result2.source[0].url);
        console.log('Source Status:', result2.source[0].status);
      }
    } else {
      console.log('❌ Test 2 FAILED:', result2.error);
    }
  } catch (error) {
    console.error('❌ Test 2 ERROR:', error);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: List all bots
  console.log("Test 3: Listing all bots");
  try {
    const response3 = await fetch('/api/bots');
    const result3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Total bots:', result3.length);
    console.log('Bots:', result3.map(b => ({ id: b.id, name: b.name, chunks: b._count?.chunk || 0 })));
    console.log('✅ Test 3 PASSED: Bots listed successfully');
  } catch (error) {
    console.error('❌ Test 3 ERROR:', error);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 All tests completed!');
}

// Run the tests
testBotCreation();
