const { loadGlobalEnvironment } = require('@sozialhelden/twelve-factor-dotenv/dist/cjs/index.js');
const env = loadGlobalEnvironment();
module.exports = env;
