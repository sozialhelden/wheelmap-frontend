const { loadGlobalEnvironment } = require('@sozialhelden/twelve-factor-dotenv');
const env = loadGlobalEnvironment();
module.exports = env;
