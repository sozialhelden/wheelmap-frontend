# This script runs inside CI deployments.
#
# At the time of writing, an Argo Workflow runs this script in a pod with pre-configured
# environment variables.
#
# More infos: http://manual.i.wheelmap.tech/infrastructure/argo/2-ci/#inside-the-ci-workflow

echo "Running tests against URL '$CI_TEST_DEPLOYMENT_BASE_URL' from environment variable CI_TEST_DEPLOYMENT_BASE_URL..."

npm install
npx playwright install --with-deps

# If tests fail, the script will exit with a non-zero status code, which will cause the CI pipeline to fail.
PLAYWRIGHT_HTML_OUTPUT_DIR=$CI_ARTIFACTS_PATH npm run test -- --reporter=html --trace=retain-on-failure

