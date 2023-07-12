#!/usr/bin/env bash

git submodule update --init --recursive
(cd postgres-explain/ && npm ci && npm run build)
npm run link:postgres-explain