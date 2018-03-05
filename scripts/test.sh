#!/bin/bash

# $ yarn test <testcase_name>
#
# Run test cases which file name partially matches the given name
# To run skipped test (skip-*.ts), need to specify full name

set -eo pipefail

yarn clean
yarn format
tsc-watch --onSuccess "yarn _on_compile_success $1" --onFailure "yarn _on_compile_failure"
