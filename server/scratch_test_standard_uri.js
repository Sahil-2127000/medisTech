require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testQuery() {
  try {
    const mongoUrl = "mongodb://medistech_db:ejOchiQZh9mjfjlu@ac-shjzngz-shard-00-00.r7vaelr.mongodb.net:27017,ac-shjzngz-shard-00-01.r7vaelr.mongodb.net:27017,ac-shjzngz-shard-00-02.r7vaelr.mongodb.net:27017/medistech?authSource=admin&replicaSet=atlas-mu2k5x-shard-0&tls=true";
    console.log("Connecting to standard MongoDB URI...");
    await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected Successfully!");
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    process.exit(0);
  } catch (err) {
    console.error("ERROR CAUGHT:");
    console.error(err);
    process.exit(1);
  }
}

testQuery();
