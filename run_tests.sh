#!/bin/bash
# This script runs inside CI deployments.
#
# At the time of writing, an Argo Workflow runs this script in a pod with pre-configured
# environment variables.
#
# Normally runs inside a container with Playwright installed. See `Dockerfile.testing` for details.

set -e
set -o pipefail

# Colors and formatting
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
BLUE=$'\033[0;34m'
CYAN=$'\033[0;36m'
BOLD=$'\033[1m'
DIM=$'\033[2m'
NC=$'\033[0m' # No Color

# Symbols
CHECK="✓"
CROSS="✗"
ARROW="→"
DOT="•"

print_header() {
  echo ""
  echo "${BLUE}${BOLD}════════════════════════════════════════════════════════════${NC}"
  echo "${BLUE}${BOLD}  $1${NC}"
  echo "${BLUE}${BOLD}════════════════════════════════════════════════════════════${NC}"
  echo ""
}

print_step() {
  echo "${CYAN}${ARROW}${NC} ${BOLD}$1${NC}"
}

print_success() {
  echo "${GREEN}${CHECK}${NC} $1"
}

print_error() {
  echo "${RED}${CROSS}${NC} $1"
}

print_info() {
  echo "${DIM}${DOT} $1${NC}"
}

# Validate required environment variables
MISSING_VARS=""
[ -z "$CI_TEST_DEPLOYMENT_BASE_URL" ] && MISSING_VARS="$MISSING_VARS CI_TEST_DEPLOYMENT_BASE_URL"
[ -z "$CI_ARTIFACTS_PATH" ] && MISSING_VARS="$MISSING_VARS CI_ARTIFACTS_PATH"

if [ -n "$MISSING_VARS" ]; then
  echo "${RED}${BOLD}Error: Missing required environment variables:${NC}"
  for var in $MISSING_VARS; do
    echo "${RED}  ${CROSS} $var${NC}"
  done
  echo ""
  echo "Usage:"
  echo "  CI_TEST_DEPLOYMENT_BASE_URL=https://example.com CI_ARTIFACTS_PATH=/artifacts ./run_tests.sh"
  exit 1
fi

print_header "Playwright E2E Test Runner"

print_step "Configuration"
print_info "Target URL: ${BOLD}${CI_TEST_DEPLOYMENT_BASE_URL}${NC}"
print_info "Artifacts:  ${BOLD}${CI_ARTIFACTS_PATH}${NC}"
echo ""

# Ensure artifacts directory and subdirectories exist
print_step "Preparing artifacts directory..."
mkdir -p "$CI_ARTIFACTS_PATH/test-results"
mkdir -p "$CI_ARTIFACTS_PATH/playwright-report"
print_success "Artifacts directory ready"
echo ""

# Temporary file for raw test output
TEST_OUTPUT="${CI_ARTIFACTS_PATH}/test-output.txt"

print_header "Running Tests"

# Run Playwright tests with multiple output formats:
# - list: Console output for live feedback
# - junit: XML format for CI systems (Jenkins, GitLab, Azure DevOps, Argo)
# - html: Interactive HTML report (don't auto-open)
# Capture output with tee for console log
TEST_EXIT_CODE=0
FORCE_COLOR=1 \
PLAYWRIGHT_HTML_OPEN=never \
PLAYWRIGHT_JUNIT_OUTPUT_NAME="${CI_ARTIFACTS_PATH}/junit.xml" \
pnpm exec playwright test \
  --reporter=list,junit,html \
  --output="${CI_ARTIFACTS_PATH}/test-results" \
  2>&1 | tee "$TEST_OUTPUT" || TEST_EXIT_CODE=$?

echo ""

# Move generated reports to artifacts directory
print_step "Collecting artifacts..."
mv playwright-report "${CI_ARTIFACTS_PATH}/playwright-report" 2>/dev/null && print_success "HTML report" || true
[ -f "${CI_ARTIFACTS_PATH}/junit.xml" ] && print_success "JUnit XML" || true


# Extract trace.zip files so trace contents are directly accessible via HTTP
print_step "Extracting trace archives..."
TRACE_TEMP=$(mktemp)
find "${CI_ARTIFACTS_PATH}/test-results" -name "trace.zip" -type f 2>/dev/null > "$TRACE_TEMP"
TRACE_COUNT=0
while IFS= read -r trace_zip; do
  [ -z "$trace_zip" ] && continue
  trace_dir="$(dirname "$trace_zip")/trace"
  if mkdir -p "$trace_dir" && unzip -o -q "$trace_zip" -d "$trace_dir" 2>/dev/null; then
    TRACE_COUNT=$((TRACE_COUNT + 1))
  else
    print_error "Failed to extract $(basename "$(dirname "$trace_zip")"))/trace.zip"
  fi
done < "$TRACE_TEMP"
rm -f "$TRACE_TEMP"
if [ "$TRACE_COUNT" -gt 0 ]; then
  print_success "Extracted $TRACE_COUNT trace archive(s)"
else
  print_info "No trace archives found"
fi
echo ""

# Detect flaky tests (tests that required retries)
FLAKY_TESTS=""
if [ -d "${CI_ARTIFACTS_PATH}/test-results" ]; then
  # Find directories with -retry suffix, extract unique test names
  FLAKY_TESTS=$(find "${CI_ARTIFACTS_PATH}/test-results" -type d -name "*-retry*" 2>/dev/null | \
    sed 's/-retry[0-9]*$//' | \
    xargs -I {} basename {} 2>/dev/null | \
    sort -u)
fi

# Clean up raw output
rm -f "$TEST_OUTPUT"

print_header "Results"

if [ $TEST_EXIT_CODE -eq 0 ]; then
  if [ -n "$FLAKY_TESTS" ]; then
    FLAKY_COUNT=$(echo "$FLAKY_TESTS" | wc -l | tr -d ' ')
    echo "${YELLOW}${BOLD}  ⚠ Warning: ${FLAKY_COUNT} flaky test(s) required retries${NC}"
    echo ""
    while IFS= read -r test; do
      # Count retry attempts
      RETRY_COUNT=$(find "${CI_ARTIFACTS_PATH}/test-results" -type d -name "${test}-retry*" 2>/dev/null | wc -l | tr -d ' ')
      TOTAL_ATTEMPTS=$((RETRY_COUNT + 1))
      echo "    ${YELLOW}${DOT}${NC} ${test} ${DIM}(${TOTAL_ATTEMPTS} attempts)${NC}"
    done
    echo ""
    echo "${GREEN}${CHECK} All tests eventually passed${NC}"
  else
    echo "${GREEN}${BOLD}  ${CHECK} All tests passed!${NC}"
  fi
else
  echo "${RED}${BOLD}  ${CROSS} Some tests failed (exit code: $TEST_EXIT_CODE)${NC}"
fi

echo ""
print_step "Artifacts"
print_info "playwright-report/ ${DIM}— Interactive HTML report${NC}"
print_info "junit.xml          ${DIM}— JUnit XML for CI systems${NC}"
print_info "test-results/      ${DIM}— Screenshots, traces, videos${NC}"
echo ""

# Show directory contents
echo "${DIM}"
ls -lah "$CI_ARTIFACTS_PATH" 2>/dev/null || true
echo "${NC}"

# Exit with original test exit code
exit $TEST_EXIT_CODE
