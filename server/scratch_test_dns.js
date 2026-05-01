const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.medistech.r7vaelr.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Resolution Error:', err);
  } else {
    console.log('SRV Addresses:', addresses);
  }
});
