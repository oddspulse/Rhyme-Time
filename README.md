# 🎵 Rhyme Time

> Say the word on beat! Viral TikTok-style rhythm game built with React Native + Expo

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![Expo](https://img.shields.io/badge/Expo-~52.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## 🎮 About

**Rhyme Time** is inspired by the viral TikTok/YouTube "Say the Word on Beat" challenge. Players must say (or tap) words exactly on the beat as images flash on screen. The twist? Every round features **rhyming words** (moon/spoon/balloon, etc). Speed increases, difficulty ramps up, and it's addictively fun!

### Features

- ✨ **Perfect Beat Sync** - Audio-driven timing engine with calibration
- 🎨 **Juicy Animations** - Powered by Reanimated for 60fps smoothness
- 🎯 **Precise Judging** - Perfect (±80ms), Good (±150ms), Miss windows
- 📈 **Progressive Difficulty** - BPM ramps from 90 → infinity
- 🎤 **Dual Input Modes** - Tap mode (ready now) + Voice mode (setup required)
- 🔥 **Viral Features** - Daily challenges, share cards, streak system
- 💾 **Local Persistence** - High scores, settings, calibration stored locally
- 🎨 **Satisfying UI** - Bold colors, haptic feedback, confetti effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app (iOS/Android) for testing

### Installation

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

### Running the App

1. **On iOS Simulator:**
   ```bash
   npx expo start --ios
   ```

2. **On Android Emulator:**
   ```bash
   npx expo start --android
   ```

3. **On Physical Device:**
   - Open Expo Go app
   - Scan the QR code from terminal
   - Enjoy the game!

## 📁 Project Structure

```
rhyme-time/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Home screen
│   ├── mode-select.tsx          # Input mode selection
│   ├── game.tsx                 # Main gameplay
│   ├── results.tsx              # Results & sharing
│   ├── calibration.tsx          # Timing calibration
│   ├── daily-challenge.tsx      # Daily challenge mode
│   └── settings.tsx             # Settings screen
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── RhymeCard.tsx       # Animated game card
│   │   ├── GameHUD.tsx         # In-game UI overlay
│   │   ├── JudgementFeedback.tsx # Perfect/Good/Miss feedback
│   │   └── Button.tsx          # Custom button
│   ├── engine/                  # Game logic
│   │   ├── BeatScheduler.ts    # Beat timing & sync
│   │   └── GameEngine.ts       # Core game loop
│   ├── store/                   # State management
│   │   └── useGameStore.ts     # Zustand store
│   ├── constants/
│   │   └── theme.ts            # Design system
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── data/
│       └── packs.json          # Rhyme pack data
├── assets/                      # Images & audio
│   └── audio/
│       ├── beat-loop-1.mp3     # (Add your beat loops here)
│       ├── beat-loop-2.mp3
│       └── beat-loop-3.mp3
├── package.json
├── tsconfig.json
└── README.md
```

## 🎵 Adding Audio Files

The game requires beat loop audio files. You need to add MP3 files to `assets/audio/`:

### Required Files:
- `beat-loop-1.mp3` - Primary beat loop (120 BPM recommended)
- `beat-loop-2.mp3` - Alternative beat (optional)
- `beat-loop-3.mp3` - Alternative beat (optional)

### Where to Find Beats:
- **Free Resources:** FreeSounds.org, YouTube Audio Library, Pixabay Music
- **Create Your Own:** GarageBand, FL Studio, or any DAW
- **Requirements:**
  - Loopable (seamless)
  - Clear beat/metronome sound
  - 90-120 BPM recommended for starter beats
  - MP3 format

### Quick Setup:
```bash
# Create audio directory if it doesn't exist
mkdir -p assets/audio

# Add your beat loop files
# (Copy your MP3 files to assets/audio/)
```

## 🎤 Voice Mode Setup

Voice recognition is **not available in Expo Go** due to native module requirements. To enable voice mode:

### Option 1: Dev Client (Recommended)

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Install speech recognition library
npm install @react-native-voice/voice

# Prebuild for native platforms
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

### Option 2: Use Tap Mode (Default)

The game defaults to **TAP MODE** which works perfectly in Expo Go and provides the full viral challenge experience. Voice mode is a future enhancement!

## 🎮 Gameplay Guide

### How to Play

1. **Select a Pack** - Choose your rhyme group (oon, ight, ake, ear)
2. **Pick Mode** - Tap mode (touch cards) or Voice mode (say words)
3. **Hit the Beat** - Tap/say the highlighted word exactly on beat
4. **Keep the Streak** - Perfect timing = more points & streak bonus
5. **Survive** - You have 3 lives; misses cost a life
6. **Level Up** - Complete rounds to increase BPM and difficulty

### Scoring System

- **Perfect Hit** (±80ms): 100 points × streak multiplier
- **Good Hit** (±150ms): 50 points × streak multiplier
- **Miss** (>150ms or wrong word): 0 points, lose 1 life
- **Streak Bonus**: +10% multiplier per 5-hit streak

### Game Config

```typescript
beatsPerRound: 16          // Beats per round
roundsPerRun: 3            // Rounds to complete a run
startingLives: 3           // Lives at start
bpmIncrement: 8            // BPM increase per round
perfectWindow: 80ms        // Perfect timing window
goodWindow: 150ms          // Good timing window
```

## 🎨 Design System

### Color Palette

```typescript
Background: #1a1a2e (deep navy)
Primary: #c9ff00 (electric lime)
Secondary: #ff006e (hot coral)
Success: #06ffa5 (bright mint)
Warning: #ffbe0b (gold)
Error: #ff006e (coral)
```

### Typography

- **Headings:** Extrabold (800)
- **Body:** Semibold (600)
- **Labels:** Medium (500)

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo` | Framework & tooling |
| `expo-av` | Audio playback |
| `expo-haptics` | Vibration feedback |
| `react-native-reanimated` | 60fps animations |
| `zustand` | State management |
| `expo-router` | File-based navigation |
| `react-native-view-shot` | Screenshot capture |

## 🔧 Customization

### Adding New Rhyme Packs

Edit `src/data/packs.json`:

```json
{
  "id": "your-pack-id",
  "name": "Pack Name",
  "difficulty": "easy|medium|hard",
  "bpmStart": 90,
  "items": [
    {
      "word": "cat",
      "imageAsset": "cat",
      "phoneticHint": "cat",
      "rhymeGroupId": "-at"
    }
  ]
}
```

### Adjusting Difficulty

In `GameEngine.ts`, modify:

```typescript
config = {
  beatsPerRound: 16,        // More beats = harder
  bpmIncrement: 8,          // Higher = faster ramp
  perfectWindow: 80,        // Lower = stricter
  goodWindow: 150,
  // ... etc
}
```

### Customizing Theme

Edit `src/constants/theme.ts` to change colors, spacing, fonts, etc.

## 🐛 Troubleshooting

### Audio not playing?

- Ensure MP3 files are in `assets/audio/`
- Check volume on device
- Verify file paths in `game.tsx`

### Timing feels off?

- Run **Calibration** from Settings
- Adjust offset for your device's latency
- Typical offsets: -50ms to +50ms

### App crashes on startup?

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

### Animations laggy?

- Check you're using a physical device (not simulator)
- Ensure Reanimated plugin is in `babel.config.js`
- Reduce concurrent animations if needed

## 📱 Build for Production

### iOS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build iOS app
eas build --platform ios
```

### Android

```bash
# Build Android APK/AAB
eas build --platform android
```

### Submit to Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## 🎯 Roadmap

- [x] Core gameplay loop
- [x] Beat synchronization engine
- [x] Tap input mode
- [x] Daily challenges
- [x] Share functionality
- [ ] Voice recognition mode
- [ ] Online leaderboards
- [ ] Pass & Play multiplayer
- [ ] More rhyme packs (100+ words)
- [ ] Achievement system
- [ ] Custom beat loop selector
- [ ] Replay recording/playback

## 🤝 Contributing

Want to add rhyme packs, improve the beat engine, or enhance visuals? Contributions welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for learning, remixing, or building your own viral game!

## 🙏 Acknowledgments

- Inspired by viral TikTok "Say the Word on Beat" challenges
- Built with ❤️ using React Native & Expo
- Beat timing architecture inspired by rhythm game engines
- Emoji graphics from Unicode Standard

## 🎮 Play & Share!

Built something cool with this? Tag us and share your high scores! 🔥

---

**Made with 🎵 by the Rhyme Time team**
