// Test script to check if bot API is working
// Run this in browser console on http://localhost:3000/dashboard

const botId = 'cml6krnpksk747j46phou0o1';

console.log('Testing bot API for:', botId);

// Test 1: Check if bot exists
fetch(`/api/bots/${botId}`)
  .then(async (r) => {
    console.log('API Response Status:', r.status, r.statusText);
    const data = await r.json();
    console.log('API Response Data:', data);
    
    if (r.ok) {
      console.log('✅ Bot API is working! Bot found:', data.name);
      console.log('Bot details:', {
        id: data.id,
        name: data.name,
        sources: data.source?.length || 0,
        chunks: data._count?.chunk || 0
      });
    } else {
      console.error('❌ Bot API returned error:', data);
      if (r.status === 404) {
        console.error('Bot not found. Possible reasons:');
        console.error('1. Bot ID is incorrect');
        console.error('2. Bot belongs to different user');
        console.error('3. Bot was deleted');
      }
    }
  })
  .catch((err) => {
    console.error('❌ Error calling bot API:', err);
  });

// Test 2: Check if route exists
console.log('\nTesting route access...');
fetch(`/dashboard/bots/${botId}/setup`)
  .then((r) => {
    console.log('Route Response Status:', r.status, r.statusText);
    if (r.status === 404) {
      console.error('❌ Route not found (404)');
      console.error('This is a Next.js routing issue, not an API issue.');
      console.error('Try:');
      console.error('1. Restart dev server: npm run dev');
      console.error('2. Clear .next cache: rm -rf .next');
      console.error('3. Check browser console for errors');
    } else {
      console.log('✅ Route exists');
    }
  })
  .catch((err) => {
    console.error('❌ Error accessing route:', err);
  });
