# from repo root
cat > lib/env.js <<'EOF'
const fs = require('fs');
const _ = require('lodash');

let logger;
try { logger = require('../config/winston'); } catch { logger = console; }

require('dotenv').config();

try {
  const envPath = `${__dirname}/../.env`;
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach((line) => {
        const m = line.match(/^([^=]+)=["']?(.*)["']?$/);
        if (m) process.env[m[1]] = m[2];
      });
    logger.info('Loaded ../.env');
  } else {
    logger.info('No ../.env; using process.env only');
  }
} catch {
  logger.info('Skipping ../.env; using process.env only');
}

if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
  process.env.MONGO_URI = process.env.MONGODB_URI;
}

const required = ['MONGO_URI'];
required.forEach((k) => {
  if (!process.env[k]) { logger.error(`Missing ${k}`); process.exit(1); }
});

module.exports = { MONGO_URI: process.env.MONGO_URI, APP_URL: process.env.APP_URL };
EOF
