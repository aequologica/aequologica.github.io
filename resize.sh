#!/bin/bash
# install ffmpeg from https://www.ffmpeg.org/
# this one worked fine : http://johnvansickle.com/ffmpeg/builds/ffmpeg-git-64bit-static.tar.xz
SQUARES=/c/Users/i051108/Documents/github.aequologica.net/aequologica.github.io/images/original/squares/*
RECTANGLES=/c/Users/i051108/Documents/github.aequologica.net/aequologica.github.io/images/original/rectangles/*
for f in $SQUARES
do
  echo "Processing $f file..."
  # take action on each file. $f store current file name
  ffmpeg -i $f -vf scale=`shuf -i 100-150 -n 1`:-1  "resized/`basename $f`"
done
for g in $RECTANGLES
do
  echo "Processing $g file..."
  # take action on each file. $g store current file name
  ffmpeg -i $g -vf scale=`shuf -i 150-250 -n 1`:-1  "resized/`basename $g`"
done