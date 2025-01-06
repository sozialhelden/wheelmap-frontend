# This is run on CI deployments.

echo "Running tests against URL '$CI_TEST_DEPLOYMENT_BASE_URL' from environment variable CI_TEST_DEPLOYMENT_BASE_URL..."
npx playwright install --with-deps
npm install @axe-core/playwright
npm run test -- --reporter=html
cp -R playwright-report $CI_ARTIFACTS_PATH
