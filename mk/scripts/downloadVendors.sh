#!/usr/bin/env bash

target_dir="`pwd`/vendor"

# Create the vendor folder if it doesn't exist.
mkdir -p "$target_dir"
cd "$target_dir"

# BOOTSTRAP 5.3.3
if [ ! -d "bootstrap-5.3.3" ]; then
  mkdir bootstrap-5.3.3
  cd bootstrap-5.3.3
  printf "bootstrap-5.3.3... "
  wget -q https://github.com/twbs/bootstrap/releases/download/v5.3.3/bootstrap-5.3.3-dist.zip || curl -OL https://github.com/twbs/bootstrap/releases/download/v5.3.3/bootstrap-5.3.3-dist.zip
  unzip -q bootstrap-5.3.3-dist.zip
  mv bootstrap-5.3.3-dist/* .
  rmdir bootstrap-5.3.3-dist
  rm bootstrap-5.3.3-dist.zip
  echo "done."
  cd ..
fi
