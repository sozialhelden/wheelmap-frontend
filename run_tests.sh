#!/bin/sh
# This script runs inside CI deployments.
#
# At the time of writing, an Argo Workflow runs this script in a pod with pre-configured
# environment variables.

set -e

echo "Running e2e tests against URL '$CI_TEST_DEPLOYMENT_BASE_URL'..."

# Create coverage directory
COVERAGE_DIR="${CI_ARTIFACTS_PATH}/coverage"
mkdir -p "$COVERAGE_DIR"

# Temporary file for raw test output
TEST_OUTPUT="${CI_ARTIFACTS_PATH}/test-output.txt"

# Run deno test with multiple output formats:
# - pretty: Console output for live feedback (default)
# - junit: XML format for CI systems (Jenkins, GitLab, Azure DevOps, Argo)
# - coverage: Code coverage data
# Capture output with tee for HTML conversion
# Use pipefail to preserve deno test exit code through pipe
set -o pipefail
TEST_EXIT_CODE=0
deno test \
  --allow-all \
  --reporter=pretty \
  --junit-path="${CI_ARTIFACTS_PATH}/junit.xml" \
  --coverage="$COVERAGE_DIR" \
  e2e/ 2>&1 | tee "$TEST_OUTPUT" || TEST_EXIT_CODE=$?

# Continue generating reports even if tests failed

# Convert ANSI output to HTML
# This uses sed to convert common ANSI escape codes to HTML spans
ansi_to_html() {
  sed -e 's/&/\&amp;/g' \
      -e 's/</\&lt;/g' \
      -e 's/>/\&gt;/g' \
      -e 's/\x1b\[0m/<\/span>/g' \
      -e 's/\x1b\[1m/<span style="font-weight:bold">/g' \
      -e 's/\x1b\[2m/<span style="opacity:0.7">/g' \
      -e 's/\x1b\[3m/<span style="font-style:italic">/g' \
      -e 's/\x1b\[4m/<span style="text-decoration:underline">/g' \
      -e 's/\x1b\[30m/<span style="color:#000">/g' \
      -e 's/\x1b\[31m/<span style="color:#c00">/g' \
      -e 's/\x1b\[32m/<span style="color:#0a0">/g' \
      -e 's/\x1b\[33m/<span style="color:#aa0">/g' \
      -e 's/\x1b\[34m/<span style="color:#00a">/g' \
      -e 's/\x1b\[35m/<span style="color:#a0a">/g' \
      -e 's/\x1b\[36m/<span style="color:#0aa">/g' \
      -e 's/\x1b\[37m/<span style="color:#aaa">/g' \
      -e 's/\x1b\[90m/<span style="color:#555">/g' \
      -e 's/\x1b\[91m/<span style="color:#f55">/g' \
      -e 's/\x1b\[92m/<span style="color:#5f5">/g' \
      -e 's/\x1b\[93m/<span style="color:#ff5">/g' \
      -e 's/\x1b\[94m/<span style="color:#55f">/g' \
      -e 's/\x1b\[95m/<span style="color:#f5f">/g' \
      -e 's/\x1b\[96m/<span style="color:#5ff">/g' \
      -e 's/\x1b\[97m/<span style="color:#fff">/g' \
      -e 's/\x1b\[[0-9;]*m//g'
}

# Generate HTML report
cat > "${CI_ARTIFACTS_PATH}/index.html" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Results</title>
  <style>
    body {
      font-family: ui-monospace, 'SF Mono', Monaco, 'Andale Mono', monospace;
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 2rem;
      line-height: 1.5;
    }
    h1 { color: #fff; margin-bottom: 1rem; }
    pre {
      background: #0d0d0d;
      padding: 1.5rem;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .links {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: #2d2d2d;
      border-radius: 8px;
    }
    .links a {
      color: #5af;
      margin-right: 1.5rem;
      text-decoration: none;
    }
    .links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Test Results</h1>
  <div class="links">
    <a href="junit.xml">JUnit XML</a>
    <a href="coverage.lcov">Coverage LCOV</a>
    <a href="coverage-html/index.html">Coverage Report</a>
  </div>
  <pre>
$(ansi_to_html < "$TEST_OUTPUT")
  </pre>
</body>
</html>
EOF

# Clean up raw output
rm -f "$TEST_OUTPUT"

# Generate coverage reports in multiple formats
echo "Generating coverage reports..."

# LCOV format (for coverage tools like Codecov, SonarQube)
deno coverage "$COVERAGE_DIR" --lcov --output="${CI_ARTIFACTS_PATH}/coverage.lcov"

# HTML report for human-readable browsing
deno coverage "$COVERAGE_DIR" --html --output="${CI_ARTIFACTS_PATH}/coverage-html"

# Summary to console
deno coverage "$COVERAGE_DIR"

ls -la "$CI_ARTIFACTS_PATH"

echo "Tests completed. Artifacts available at '$CI_ARTIFACTS_PATH':"
echo "  - index.html: Test results with ANSI colors"
echo "  - junit.xml: JUnit XML report for CI systems"
echo "  - coverage.lcov: LCOV coverage report"
echo "  - coverage-html/: Interactive HTML coverage report"

# Exit with original test exit code
exit $TEST_EXIT_CODE
