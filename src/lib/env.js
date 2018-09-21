const publicEnv = require(`../../env/${process.env.NODE_ENV}.public`);
let privateEnv = {};
if (typeof window === 'undefined') {
  privateEnv = require(`../../env/${process.env.NODE_ENV}`);
}

const env = { ...privateEnv, public: publicEnv };
module.exports = env;
