// lib/env.js
require('dotenv').config();

// split helper
const splitCSV = (v) =>
  (v || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

// minimal validation (warn only, don’t crash)
const required = ['MONGO_URI', 'JWT_SECRET_TOKEN'];
for (const k of required) {
  if (!process.env[k]) {
    console.warn(`[env] Missing ${k}`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 3001,

  // URLs
  appUrl: process.env.APP_URL,
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKENDEND_URL,

  // DB
  mongoUri: process.env.MONGO_URI,

  // Blob
  blobBaseUrl: process.env.BLOB_BASE_URL,
  blobToken: process.env.RITE_TOKEN || process.env.BLOB_WRITE_TOKEN,

  // Mail
  sendgridKey: process.env.SENDGRID_API_KEY,
  mailFrom: process.env.MAIL_FROM || process.env.MAIL_ID_FROM,

  // Auth
  jwtSecret: process.env.JWT_SECRET_TOKEN,

  // CORS
  corsOrigins: splitCSV(process.env.CORS_ORIGINS),
};
