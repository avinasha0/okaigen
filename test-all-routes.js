/**
 * Comprehensive API Routes Test Script
 * 
 * Instructions:
 * 1. Make sure you're logged into the dashboard
 * 2. Open browser console (F12) on any dashboard page
 * 3. Copy and paste this entire script
 * 4. Press Enter to run all tests
 * 
 * This will test all major API endpoints and report any issues.
 */

async function testAllRoutes() {
  const results = {
    passed: [],
    failed: [],
    skipped: [],
  };

  console.log("🧪 Starting Comprehensive API Routes Test...\n");
  console.log("=".repeat(70));

  // Helper function to test an endpoint
  async function testEndpoint(name, method, url, options = {}) {
    try {
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...(options.body && { body: JSON.stringify(options.body) }),
      });

      const status = response.status;
      const contentType = response.headers.get('content-type') || '';
      let data = null;
      
      try {
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      } catch {
        // Ignore parse errors
      }

      if (status >= 200 && status < 300) {
        results.passed.push({ name, status, method, url });
        return { success: true, status, data };
      } else if (status === 401 || status === 403) {
        results.skipped.push({ name, status, reason: 'Auth required' });
        return { success: false, status, reason: 'Auth required' };
      } else {
        results.failed.push({ name, status, error: data?.error || 'Unknown error', method, url });
        return { success: false, status, error: data?.error || 'Unknown error' };
      }
    } catch (error) {
      results.failed.push({ name, error: error.message, method, url });
      return { success: false, error: error.message };
    }
  }

  // Test 1: Get current user session
  console.log("\n1️⃣ Testing Authentication...");
  const sessionTest = await testEndpoint('Get Session', 'GET', '/api/auth/session');
  if (!sessionTest.success) {
    console.log("⚠️  Not authenticated. Some tests will be skipped.");
  } else {
    console.log("✅ Session valid");
  }

  // Test 2: Get bots list
  console.log("\n2️⃣ Testing Bots API...");
  const botsTest = await testEndpoint('List Bots', 'GET', '/api/bots');
  if (botsTest.success && botsTest.data) {
    console.log(`✅ Bots API: Found ${botsTest.data.length || 0} bots`);
    const botId = botsTest.data?.[0]?.id;
    
    if (botId) {
      // Test bot details
      await testEndpoint('Get Bot Details', 'GET', `/api/bots/${botId}`);
      
      // Test bot analytics (if plan allows)
      await testEndpoint('Get Bot Analytics', 'GET', `/api/bots/${botId}/analytics?days=30`);
      
      // Test bot chats
      await testEndpoint('Get Bot Chats', 'GET', `/api/bots/${botId}/chats`);
      
      // Test bot leads
      await testEndpoint('Get Bot Leads', 'GET', `/api/bots/${botId}/leads`);
      
      // Test bot sources
      await testEndpoint('Get Bot Sources', 'GET', `/api/bots/${botId}/sources`);
    }
  }

  // Test 3: Plan Usage
  console.log("\n3️⃣ Testing Plan Usage API...");
  await testEndpoint('Get Plan Usage', 'GET', '/api/plan-usage');

  // Test 4: Team API
  console.log("\n4️⃣ Testing Team API...");
  await testEndpoint('Get Team Members', 'GET', '/api/team');
  await testEndpoint('Get Team Invitations', 'GET', '/api/team/invitations');

  // Test 5: Leads API
  console.log("\n5️⃣ Testing Leads API...");
  await testEndpoint('Get All Leads', 'GET', '/api/leads');

  // Test 6: API Keys API
  console.log("\n6️⃣ Testing API Keys API...");
  await testEndpoint('Get API Keys', 'GET', '/api/api-keys');

  // Test 7: Webhooks API
  console.log("\n7️⃣ Testing Webhooks API...");
  await testEndpoint('Get Webhooks', 'GET', '/api/webhooks');

  // Test 8: User Profile API
  console.log("\n8️⃣ Testing User Profile API...");
  await testEndpoint('Get User Profile', 'GET', '/api/user/profile');

  // Test 9: Embed Info API (public)
  console.log("\n9️⃣ Testing Embed Info API (Public)...");
  if (botsTest.success && botsTest.data?.[0]?.publicKey) {
    await testEndpoint('Get Embed Info', 'GET', `/api/embed/info?botId=${botsTest.data[0].publicKey}`);
  }

  // Test 10: Contact API (public)
  console.log("\n🔟 Testing Contact API (Public)...");
  await testEndpoint('Contact Form', 'POST', '/api/contact', {
    body: {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'Test message',
    },
  });

  // Print Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 TEST SUMMARY\n");
  
  console.log(`✅ Passed: ${results.passed.length}`);
  results.passed.forEach(r => {
    console.log(`   ✓ ${r.name} (${r.method} ${r.url}) - ${r.status}`);
  });

  console.log(`\n⏭️  Skipped: ${results.skipped.length}`);
  results.skipped.forEach(r => {
    console.log(`   ⊘ ${r.name} - ${r.reason || 'Auth required'}`);
  });

  console.log(`\n❌ Failed: ${results.failed.length}`);
  results.failed.forEach(r => {
    console.log(`   ✗ ${r.name} (${r.method} ${r.url})`);
    console.log(`     Error: ${r.error || r.status || 'Unknown'}`);
  });

  console.log("\n" + "=".repeat(70));
  console.log(`\n🎯 Overall: ${results.passed.length} passed, ${results.skipped.length} skipped, ${results.failed.length} failed`);
  
  if (results.failed.length === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Check the errors above.");
  }

  return results;
}

// Run the tests
testAllRoutes().then(results => {
  console.log("\n💾 Test results saved to window.testResults");
  window.testResults = results;
});
