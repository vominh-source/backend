#!/bin/bash
echo "=== Environment Check ==="
echo "NODE_ENV: $NODE_ENV"
echo "AWS_REGION: $AWS_REGION"
echo "PORT: $PORT"
echo "=== Directory Check ==="
pwd
ls -la
echo "=== Dist Check ==="
ls -la dist/
echo "=== Starting Application ==="
node dist/index.js
