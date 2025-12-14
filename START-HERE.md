# ⚡ START HERE - Get Playing in 2 Minutes!

## ⚠️ IMPORTANT: Audio File Required!

Your game is **99% ready** - you just need to add ONE audio file, then you're good to go!

---

## 🎵 Step 1: Get a Beat Loop MP3 (Choose One Method)

### Method A: Download Free Beat (BEST)

1. **Open this link in your browser:**
   ```
   https://pixabay.com/music/search/beat%20loop/
   ```

2. **Click any beat loop you like** → Click "Download"
   - No account needed
   - 100% free
   - Takes 10 seconds

3. **Save as:** `beat-loop-1.mp3`

4. **Move to game folder:**
   ```bash
   # From your terminal, in the Rhyme-Time directory:
   mv ~/Downloads/beat-loop-1.mp3 assets/audio/
   ```

### Method B: Use Any MP3 You Have (QUICK TEST)

For testing, ANY MP3 file works:

```bash
# Find MP3 files on your system:
find ~ -name "*.mp3" -type f 2>/dev/null | head -5

# Copy any one:
cp /path/to/any-song.mp3 assets/audio/beat-loop-1.mp3
```

### Method C: wget Direct Download (if you have wget)

```bash
# Download a free beat directly
wget -O assets/audio/beat-loop-1.mp3 "https://cdn.pixabay.com/audio/2024/03/28/audio_example.mp3"
```

---

## 🚀 Step 2: Start the App

Once you have the audio file:

```bash
npx expo start
```

You should see:
```
Starting Metro Bundler...
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

## 📱 Step 3: Open on Your Phone

**iPhone:**
1. Install "Expo Go" from App Store
2. Open Camera app
3. Scan QR code from terminal
4. App opens automatically!

**Android:**
1. Install "Expo Go" from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan code from terminal

**Or use simulator:**
```bash
npx expo start --ios     # iOS
npx expo start --android # Android
```

---

## ✅ Verify Setup

Check that your audio file exists:

```bash
# Should show the file with size > 0
ls -lh assets/audio/beat-loop-1.mp3
```

Expected output:
```
-rw-r--r-- 1 user user 2.3M Dec 14 10:00 assets/audio/beat-loop-1.mp3
```

---

## 🐛 Troubleshooting

**"Cannot find module"**
```bash
rm -rf node_modules
npm install
```

**"Audio file not found" error in app**
```bash
# Check file exists:
ls assets/audio/beat-loop-1.mp3

# If missing, go back to Step 1
```

**Metro bundler fails to start**
```bash
npx expo start --clear
```

---

## 🎮 First Run Checklist

Once app loads:
1. ✅ See "RHYME TIME" on home screen
2. ✅ Tap "PLAY" → mode select appears
3. ✅ Tap "TAP MODE" → game loads
4. ✅ Hear beat playing
5. ✅ See 8 cards in grid
6. ✅ One card highlights per beat
7. ✅ Tap highlighted card → see "PERFECT/GOOD/MISS"

---

## 📚 Full Documentation

- **QUICKSTART.md** - 5-minute guide
- **SETUP.md** - Detailed setup
- **README.md** - Full project docs
- **assets/audio/README.md** - Audio sources

---

## 🎵 You're Almost There!

Just add that one audio file and you're ready to play!

**Summary:**
1. ✅ Dependencies installed
2. ⬜ Add audio file → `assets/audio/beat-loop-1.mp3`
3. ⬜ Run `npx expo start`
4. ⬜ Play the game!

---

**Questions?** Check the docs or README.md for more help!
