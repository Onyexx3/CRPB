/**
 * app.cjs - Production entry point for Namecheap cPanel shared hosting
 * 
 * This file serves as the root entry point for Node.js applications
 * in cPanel environments. It requires the built server from dist/server.cjs
 * and ensures proper serving of static files from dist/public.
 * 
 * IMPORTANT: Before deployment, ensure you have:
 * 1. Run 'npm install --production' to install dependencies
 * 2. Run 'npm run build' to build the application
 * 3. Set NODE_ENV=production in cPanel Node.js environment variables
 * 4. Set PORT to the port assigned by cPanel (usually shown in the interface)
 * 5. Upload .htaccess file for proper routing
 */

require('dotenv/config');

// Load the compiled server
const serverPath = require('path').join(__dirname, 'dist', 'server.cjs');

console.log('Starting application...');
console.log('Server path:', serverPath);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || '5000');

// Check if build exists
const fs = require('fs');
if (!fs.existsSync(serverPath)) {
  console.error('ERROR: Server build not found at', serverPath);
  console.error('Please run "npm run build" before starting the application');
  process.exit(1);
}

const publicPath = require('path').join(__dirname, 'dist', 'public');
if (!fs.existsSync(publicPath)) {
  console.error('ERROR: Client build not found at', publicPath);
  console.error('Please run "npm run build" before starting the application');
  process.exit(1);
}

console.log('Build files verified successfully');

// Require the server (this will start the Express application)
require(serverPath);
