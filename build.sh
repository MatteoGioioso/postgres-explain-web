#!/usr/bin/env bash

git submodule update --init --recursive --remote
(cd postgres-explain/ && npm ci && npm run build)
npm run link:postgres-explain && npm run build # Weird bug on npm link with react
npm run link:postgres-explain && npm run build