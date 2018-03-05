#!/bin/bash

set -euo pipefail

yarn clean
yarn format
tsc-watch --onSuccess 'yarn _on_compile_success ALL' --onFailure 'yarn _on_compile_failure'
