// dotenv.config({ path: path.resolve(__dirname, '.env') });
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default function getBaseURL() {
  if (!process.env.CI_TEST_DEPLOYMENT_BASE_URL) {
    throw new Error('Please set the CI_TEST_DEPLOYMENT_BASE_URL environment variable before testing.');
  }

  const baseURLFromEnvVariable = new URL(process.env.CI_TEST_DEPLOYMENT_BASE_URL);
  baseURLFromEnvVariable.hash = '';
  baseURLFromEnvVariable.search = '';
  const baseURL = baseURLFromEnvVariable.toString();
  return baseURL;
}
