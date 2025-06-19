// Test Supabase connection
// Run this in browser console to test connectivity

const supabaseUrl = 'https://fgpmeulzlrdgnlmibjkm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncG1ldWx6bHJkZ25sbWliamttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MTM3NzUsImV4cCI6MjA2NDk4OTc3NX0.Y0rhUu-v5EE-0MI-zGCkKWv7zUtzj2Lgdg65xmI9L9o';

// Test basic connectivity
fetch(`${supabaseUrl}/rest/v1/profiles?select=count`, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
})
.then(response => {
  console.log('Supabase connection test:', response.status, response.statusText);
  return response.json();
})
.then(data => {
  console.log('Response data:', data);
})
.catch(error => {
  console.error('Connection error:', error);
});

// Test auth endpoint specifically
fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': supabaseKey
  },
  body: JSON.stringify({
    email: 'jeff@houinc.com',
    password: '3469710121'
  })
})
.then(response => {
  console.log('Auth endpoint test:', response.status, response.statusText);
  return response.json();
})
.then(data => {
  console.log('Auth response:', data);
})
.catch(error => {
  console.error('Auth error:', error);
}); 