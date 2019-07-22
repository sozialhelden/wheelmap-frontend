let env = (typeof window !== 'undefined' && window.env) || {};

if (typeof window === 'undefined') {
  const fs = require('fs');
  try {
    const stats = fs.statSync('.env');
    if (stats && stats.isFile()) {
      const dotenvConfig = require('dotenv').config();
      if (dotenvConfig.error) {
        throw dotenvConfig.error;
      }

      Object.assign(env, dotenvConfig.parsed, process.env);
    }
  } catch (e) {
    console.log('No .env file existing or accessible:', e);
  }
}

module.exports = env;
