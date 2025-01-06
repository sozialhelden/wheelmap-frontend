# This is run on CI deployments.

npx playwright install --with-deps
npm install @axe-core/playwright
npm run test -- --reporter=html
cp -R playwright-report $CI_ARTIFACTS_PATH
