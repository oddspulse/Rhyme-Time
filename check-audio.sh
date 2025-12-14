#!/bin/bash

echo "🎵 Rhyme Time - Audio File Setup Helper"
echo "========================================"
echo ""

TARGET_FILE="assets/audio/beat-loop-1.mp3"

# Check if file already exists
if [ -f "$TARGET_FILE" ]; then
    echo "✅ Audio file already exists!"
    ls -lh "$TARGET_FILE"
    echo ""
    echo "The file is ready. You can now run:"
    echo "  npx expo start --clear"
    exit 0
fi

echo "❌ Audio file NOT found at: $TARGET_FILE"
echo ""
echo "Let me help you find and add an MP3 file..."
echo ""

# Search for MP3 files
echo "🔍 Searching for MP3 files on your system..."
echo ""

MP3_FILES=$(find ~/Downloads -name "*.mp3" -type f 2>/dev/null | head -10)

if [ -n "$MP3_FILES" ]; then
    echo "📁 Found these MP3 files in ~/Downloads:"
    echo "$MP3_FILES" | nl
    echo ""
    echo "To use one of these files:"
    echo ""
    echo "  cp /path/to/your-file.mp3 $TARGET_FILE"
    echo ""
else
    echo "No MP3 files found in ~/Downloads"
    echo ""
fi

echo "================================"
echo "📥 How to get an audio file:"
echo ""
echo "OPTION 1: Download a free beat loop"
echo "  1. Open: https://pixabay.com/music/search/beat%20loop/"
echo "  2. Click any beat → Download"
echo "  3. Run: cp ~/Downloads/downloaded-file.mp3 $TARGET_FILE"
echo ""
echo "OPTION 2: Use any MP3 you have"
echo "  Run: cp /path/to/any-music.mp3 $TARGET_FILE"
echo ""
echo "================================"
echo ""
echo "After adding the file, run:"
echo "  npx expo start --clear"
echo ""
