# Rhyme Time - Complete Setup Guide

This guide will help you get **Rhyme Time** up and running from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)
- A code editor (VS Code recommended)

### For iOS Development:
- macOS with Xcode installed
- iOS Simulator or physical iPhone

### For Android Development:
- Android Studio with emulator
- Or a physical Android device

## 🚀 Step-by-Step Setup

### 1. Install Dependencies

```bash
# Navigate to the project directory
cd rhyme-time

# Install all npm packages
npm install
```

Expected output: Package installation completes without errors.

### 2. Add Audio Files (IMPORTANT!)

The app **requires audio files** to run. You have two options:

#### Option A: Quick Test (Use Placeholder)

For quick testing, you can use any MP3 file:

```bash
# Create the audio directory
mkdir -p assets/audio

# Copy any MP3 file you have as a placeholder
cp /path/to/any-audio.mp3 assets/audio/beat-loop-1.mp3
```

#### Option B: Get Proper Beat Loops (Recommended)

1. Visit [Pixabay Music](https://pixabay.com/music/)
2. Search for "drum loop 120 bpm" or "metronome"
3. Download a free beat loop
4. Rename to `beat-loop-1.mp3`
5. Place in `assets/audio/`

See `assets/audio/README.md` for more sources.

### 3. Verify Setup

Check that everything is in place:

```bash
# Verify audio file exists
ls -lh assets/audio/beat-loop-1.mp3

# Should show the file with size > 0
```

### 4. Start Development Server

```bash
npx expo start
```

You should see:
```
Starting Metro bundler...
Metro waiting on exp://192.168.x.x:8081
```

### 5. Run on Device/Simulator

#### On iOS Simulator:
```bash
# Press 'i' in the terminal, or:
npx expo start --ios
```

#### On Android Emulator:
```bash
# Press 'a' in the terminal, or:
npx expo start --android
```

#### On Physical Device (Easiest!):
1. Install **Expo Go** from App Store / Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

## ✅ First Run Checklist

Once the app loads:

1. **Home Screen** - Should see "RHYME TIME" title
2. **Tap PLAY** - Navigate to mode select
3. **Select TAP MODE** - Start a game
4. **Gameplay Loads** - Grid of 8 cards appears
5. **Audio Plays** - You hear the beat loop
6. **Tap Cards** - Tap highlighted cards on beat
7. **Get Feedback** - See PERFECT/GOOD/MISS messages

## 🐛 Troubleshooting

### "Cannot find module 'expo'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Audio file not found"
- Check that `assets/audio/beat-loop-1.mp3` exists
- Verify file is a valid MP3
- Try a different audio file

### "Metro bundler error"
```bash
# Clear cache
npx expo start --clear

# Or use tunnel mode
npx expo start --tunnel
```

### App crashes on game screen
- Most likely missing audio file
- Check console for error messages
- Ensure audio file is valid MP3 format

### Animations are laggy
- **Don't test on web browser** - web performance is limited
- Use iOS Simulator, Android Emulator, or physical device
- Physical devices have best performance

### "Reanimated plugin not configured"
Check `babel.config.js` includes:
```javascript
plugins: [
  'react-native-reanimated/plugin',
]
```

## 🎵 Audio Setup Deep Dive

### Why Audio Files Are Required

The game's beat synchronization engine uses audio playback position as the source of truth for timing. Without audio, the game cannot determine when beats occur.

### Creating Your Own Beat Loop

#### Using GarageBand (Mac):
1. Open GarageBand
2. New Project → Empty Project
3. Add Drummer track
4. Set BPM to 120
5. Record 4 bars
6. File → Export → MP3

#### Using Online Tools:
1. Visit https://www.drumbot.com/
2. Create a simple kick drum pattern
3. Set BPM to 120
4. Download as MP3

### Converting Audio Formats

If you have WAV, M4A, or other formats:

```bash
# Using ffmpeg (install with: brew install ffmpeg)
ffmpeg -i input.wav -acodec libmp3lame -b:a 192k beat-loop-1.mp3
```

## 🎯 Next Steps After Setup

### 1. Calibrate Your Device

- Go to Settings → Calibration
- Follow on-screen instructions
- This improves timing accuracy

### 2. Customize Game Settings

Edit `src/engine/GameEngine.ts`:

```typescript
config = {
  beatsPerRound: 16,     // Try 8 for easier, 32 for harder
  perfectWindow: 80,     // Lower = stricter timing
  bpmIncrement: 8,       // BPM increase per round
}
```

### 3. Add More Rhyme Packs

Edit `src/data/packs.json` to add new rhyme groups.

### 4. Customize Colors

Edit `src/constants/theme.ts` to change the color scheme.

## 🚢 Building for Production

### Development Client (for Voice Mode)

To use native modules like voice recognition:

```bash
# Install dev client
npx expo install expo-dev-client

# Prebuild native projects
npx expo prebuild

# Run on iOS with dev client
npx expo run:ios

# Run on Android with dev client
npx expo run:android
```

### Production Builds

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

## 📱 Testing on Physical Devices

### iOS (using Expo Go):
1. Install Expo Go from App Store
2. Ensure iPhone and computer on same WiFi
3. Open Camera app
4. Scan QR code from terminal
5. Opens in Expo Go automatically

### Android (using Expo Go):
1. Install Expo Go from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan code from terminal
5. App loads

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/)
- [Expo Router](https://expo.github.io/router/)

## 💬 Getting Help

If you encounter issues:

1. Check this SETUP.md
2. Read main README.md
3. Check `assets/audio/README.md` for audio help
4. Review error messages in terminal
5. Try with a fresh `npm install`

## 🎮 Ready to Play!

Once setup is complete:
1. Launch the app
2. Select a rhyme pack
3. Choose TAP mode
4. Start playing
5. Beat your high score!

---

**Happy Gaming! 🎵**
