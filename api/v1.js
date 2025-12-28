const app = require('../server/server.js');

// Export Express app for Vercel serverless function
// Vercel will automatically route /api/v1/* to this function
// Express app already has routes with /api/v1 prefix, so paths will match correctly
module.exports = app;

