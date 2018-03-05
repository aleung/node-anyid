#!/bin/bash

set -eo pipefail

echo "Compile successed."

export NODE_ENV=development

if [[ $1 == 'ALL' ]] ; then
  echo "Note: 'testall' runs scripts with prefix 'skip-' as well."
  _mocha --exit --trace-warnings -r source-map-support/register -c "build/test/**/@(skip|test)-*.js" &
else
  _mocha --exit --trace-warnings -r source-map-support/register -c "build/test/**/@(test-*$1*|$1).js" &
fi

yarn format &
yarn toc &
yarn _copylib &

wait

echo "+===================================================+"
echo "| Will auto restart on code change. Ctrl-C to exit. |"
echo "+===================================================+"
