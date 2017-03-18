#!/bin/bash -e
git add .
git commit -am "update"
git config --global http.proxy http://proxy:8080
git push
git config --global --unset http.proxy
