#!/bin/bash
# Build script with increased memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
