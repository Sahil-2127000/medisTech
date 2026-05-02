async function run() {
  const email = 'verify@test.com';
  const otp = '528672';
  const newPassword = 'Password@123'; // Same as old
  
  try {
    console.log('--- Phase 2: Resetting Password with SAME password ---');
    const res = await fetch('http://localhost:5001/api/auth/public/forgot-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Response Message:', data.message);
    
    if (res.status === 400 && data.message === 'New password cannot be the same as the old password') {
      console.log('SUCCESS: Reuse prevented correctly.');
    } else {
      console.log('FAILURE: Unexpected response.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
