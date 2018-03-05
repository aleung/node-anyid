#!/bin/bash

set -euo pipefail

yarn clean

yarn format &
yarn toc &
wait

yarn compile

yarn _copylib &
yarn lint &
wait
