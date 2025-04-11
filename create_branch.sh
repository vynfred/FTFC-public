#!/bin/bash
export GIT_PAGER=cat
git add .
git commit -m "Fix ClientPortal component"
git checkout -b FTFC-3.3-Integrations
echo "Created new branch FTFC-3.3-Integrations"
