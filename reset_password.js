async function run() {
  const email = 'verify@test.com';
  const otp = '335781';
  const newPassword = 'Password@123'; // Same as old
  
  try {
    const res = await fetch('http://localhost:5001/api/auth/public/forgot-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Response Message:', data.message);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
run();
