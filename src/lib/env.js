const nodeEnv = process.env.NODE_ENV || 'development';
const publicEnv = require(`../../env/${nodeEnv}.public`);
let privateEnv = {};
if (typeof window === 'undefined') {
  privateEnv = require(`../../env/${nodeEnv}`);
}

const env = { ...privateEnv, public: publicEnv };
module.exports = env;
