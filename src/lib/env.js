// This enables us to configure the app at runtime, without having to re-compile/deploy the code.
// It avoids introducing subtle build-system related bugs when changing the configuration, e.g.
// when debugging problems that arise from a configuration error alone.

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
