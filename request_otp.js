async function run() {
  const email = 'verify@test.com';
  try {
    const res = await fetch('http://localhost:5001/api/auth/public/forgot-password-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    console.log('OTP Response:', data.message);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
run();
