# This is run on CI deployments.

npx playwright install --with-deps
npm run test
cp -R playwright-report $CI_ARTIFACTS_PATH
