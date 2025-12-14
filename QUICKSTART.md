# 🚀 Quick Start - 5 Minutes to Playing

Get Rhyme Time running in 5 minutes or less!

## 1️⃣ Install Dependencies (1 min)

```bash
npm install
```

## 2️⃣ Add Audio File (2 min)

**You MUST add at least one audio file for the game to work.**

### Fastest Option:
1. Download any MP3 beat from [Pixabay](https://pixabay.com/music/search/beat%20loop/)
2. Save as `beat-loop-1.mp3`
3. Place in `assets/audio/` folder

```bash
# Create directory
mkdir -p assets/audio

# Move your downloaded file
mv ~/Downloads/your-beat.mp3 assets/audio/beat-loop-1.mp3
```

### Alternative - Use Any MP3:
For quick testing, ANY MP3 file will work:

```bash
# Copy any MP3 you have
cp /path/to/any-song.mp3 assets/audio/beat-loop-1.mp3
```

## 3️⃣ Start the App (1 min)

```bash
npx expo start
```

## 4️⃣ Open on Device (1 min)

**Easiest - Physical Device:**
1. Install "Expo Go" from App Store / Play Store
2. Scan QR code with camera (iOS) or Expo Go app (Android)
3. App loads automatically!

**Or - Simulator:**
```bash
npx expo start --ios     # iOS simulator
npx expo start --android # Android emulator
```

## 5️⃣ Play! 🎮

1. Tap **PLAY**
2. Select **TAP MODE**
3. Tap highlighted cards on the beat
4. Try to get PERFECT timing!

---

## ✅ Success Checklist

- [ ] `npm install` completed without errors
- [ ] `assets/audio/beat-loop-1.mp3` exists
- [ ] `npx expo start` shows QR code
- [ ] App loads on device/simulator
- [ ] Game plays with audio

## 🆘 Troubleshooting

**"Cannot find audio file"**
→ Check that `assets/audio/beat-loop-1.mp3` exists

**"Module not found"**
→ Delete `node_modules` and run `npm install` again

**App won't load**
→ Make sure phone and computer are on same WiFi

**Still stuck?**
→ See full [SETUP.md](./SETUP.md) guide

---

## 🎯 Next Steps

Once you're playing:
- Try **Daily Challenge** mode
- Calibrate your device in **Settings**
- Beat your high score!
- Share your results 📤

---

**That's it! You're ready to rhyme on time! 🎵**
