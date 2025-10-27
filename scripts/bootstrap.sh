#!/bin/bash

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found"; exit 1; }

ffmpeg -i media/bbb_1080p.mp4 media/bbb_1080p.y4m
