#!/bin/bash

set -euo pipefail

export NODE_ENV=development

yarn clean

echo '>>> Compiling...'

yarn compile
yarn _copylib

echo '>>> Testing...'
echo '(Detail log and report are generated under reports folder)'

mkdir -p reports

nyc --reporter=text-summary --reporter=html --report-dir=reports/coverage mocha --exit -r source-map-support/register --reporter mochawesome --reporter-options reportDir=reports/testcase,reportFilename=index,quiet=true 'build/test/**/test-*.js' 3>&2 2>&1 1>&3- | tee reports/testlog.json

echo '>>> Linting...'

tslint --project tsconfig.json
