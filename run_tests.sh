# This is run on CI deployments.

echo "Running tests against URL '$CI_TEST_DEPLOYMENT_BASE_URL' from environment variable CI_TEST_DEPLOYMENT_BASE_URL..."
npx playwright install --with-deps
npm install @axe-core/playwright

echo "(TODO: Generate correct URL in run_tests.sh)" > /tmp/test-result-url.txt

# If tests fail, the script will exit with a non-zero status code, which will cause the CI pipeline to fail.
PLAYWRIGHT_HTML_OUTPUT_DIR=$CI_ARTIFACTS_PATH npm run test -- --reporter=html
