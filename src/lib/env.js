let env = (typeof window !== 'undefined' && window.env) || {};

if (typeof window === 'undefined') {
  const dotenvConfig = require('dotenv').config();
  if (dotenvConfig.error) {
    throw dotenvConfig.error;
  }

  Object.assign(env, dotenvConfig.parsed, process.env);
}

module.exports = env;
