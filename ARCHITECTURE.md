# Rhyme Time - Technical Architecture

This document explains the technical architecture and design decisions for Rhyme Time.

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────┐
│              UI Layer (React Native)             │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │  Screens │  │Components│  │  Animations   │ │
│  │          │  │          │  │  (Reanimated) │ │
│  └────┬─────┘  └────┬─────┘  └───────┬───────┘ │
│       │             │                 │         │
└───────┼─────────────┼─────────────────┼─────────┘
        │             │                 │
┌───────┼─────────────┼─────────────────┼─────────┐
│       │    State Management (Zustand) │         │
│  ┌────▼─────┐  ┌──▼──────┐  ┌────────▼──────┐  │
│  │ Settings │  │ Scores  │  │  Daily Chall  │  │
│  └──────────┘  └─────────┘  └───────────────┘  │
└─────────────────────────────────────────────────┘
                     │
┌────────────────────┼─────────────────────────────┐
│            Game Engine Layer                     │
│  ┌─────────────┐  │  ┌────────────────────────┐ │
│  │GameEngine   │◄─┼─►│  BeatScheduler         │ │
│  │- Game Loop  │  │  │  - Beat Timing         │ │
│  │- Input      │  │  │  - Sync Audio          │ │
│  │- Scoring    │  │  │  - Calibration         │ │
│  └──────┬──────┘  │  └────────────────────────┘ │
│         │         │                              │
└─────────┼─────────┼──────────────────────────────┘
          │         │
┌─────────▼─────────▼──────────────────────────────┐
│         Platform Services                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │expo-av   │  │expo-     │  │AsyncStorage   │  │
│  │(Audio)   │  │haptics   │  │(Persistence)  │  │
│  └──────────┘  └──────────┘  └───────────────┘  │
└──────────────────────────────────────────────────┘
```

## 📂 Directory Structure

```
rhyme-time/
│
├── app/                        # Expo Router screens
│   ├── _layout.tsx            # Root layout + providers
│   ├── index.tsx              # Home screen
│   ├── mode-select.tsx        # Input mode selection
│   ├── game.tsx               # Main gameplay screen
│   ├── results.tsx            # Post-game results
│   ├── calibration.tsx        # Timing calibration
│   ├── daily-challenge.tsx    # Daily challenge mode
│   └── settings.tsx           # Settings screen
│
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── RhymeCard.tsx     # Animated game card (core component)
│   │   ├── GameHUD.tsx       # In-game UI overlay
│   │   ├── JudgementFeedback.tsx # Feedback animations
│   │   └── Button.tsx        # Custom button component
│   │
│   ├── engine/               # Game logic (pure TypeScript)
│   │   ├── BeatScheduler.ts  # Beat timing engine
│   │   └── GameEngine.ts     # Core game loop & logic
│   │
│   ├── store/                # State management
│   │   └── useGameStore.ts   # Zustand store (settings, scores)
│   │
│   ├── constants/
│   │   └── theme.ts          # Design system tokens
│   │
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   │
│   └── data/
│       └── packs.json        # Rhyme pack content
│
└── assets/
    ├── audio/                # Beat loop audio files
    └── images/               # Icons, splash screens
```

## 🎮 Core Systems

### 1. Beat Synchronization Engine

**Location:** `src/engine/BeatScheduler.ts`

**Responsibility:** Precise beat timing using audio as source of truth.

```typescript
class BeatScheduler {
  // Pre-compute all beat timestamps for a round
  generateBeatTimestamps()

  // Check if next beat should trigger
  getNextBeat(audioPositionMs): BeatTimestamp | null

  // Judge user input timing
  judgeInput(audioPositionMs, targetBeatIndex): 'perfect' | 'good' | 'miss'
}
```

**Key Features:**
- Audio position as single source of truth
- Pre-computed beat timestamps for performance
- Calibration offset support
- BPM ramping within rounds

**Timing Windows:**
```
Perfect: ±80ms from beat
Good:    ±150ms from beat
Miss:    >150ms from beat
```

### 2. Game Engine

**Location:** `src/engine/GameEngine.ts`

**Responsibility:** Core game loop, state management, scoring.

```typescript
class GameEngine {
  // Game lifecycle
  async start(audioFile)
  async pause()
  async resume()
  async destroy()

  // Input handling
  handleInput(word: string)

  // Event system
  on(event: GameEventType, callback)
  emit(event: GameEventType, data)
}
```

**Game Loop:**
1. Request animation frame
2. Get audio playback position
3. Check for next beat
4. Trigger beat event if time reached
5. Update UI via events
6. Repeat

**Events:**
- `beat` - Beat occurred, highlight next card
- `judgement` - User input judged
- `round-complete` - Round finished
- `game-over` - Lost (lives = 0)
- `game-complete` - Won (all rounds complete)

### 3. State Management

**Location:** `src/store/useGameStore.ts`

**Technology:** Zustand (lightweight, simple)

**State Structure:**
```typescript
{
  settings: {
    inputMode: 'tap' | 'voice',
    selectedPackId: string,
    calibration: { offset: number, isCalibrated: boolean },
    musicVolume: number,
    sfxVolume: number,
    hapticsEnabled: boolean
  },
  highScores: HighScore[],
  dailyChallenge: DailyChallenge | null
}
```

**Persistence:** AsyncStorage for all state

**Why Zustand?**
- Minimal boilerplate
- No providers needed
- Great TypeScript support
- Small bundle size (~1KB)

### 4. Animation System

**Technology:** React Native Reanimated 3

**Components:**
- `RhymeCard` - Scale + glow on beat
- `JudgementFeedback` - Pop-in score overlay
- `GameHUD` - Live updating stats

**Animation Patterns:**

```typescript
// On-beat card highlight
scale.value = withSequence(
  withSpring(1.06),  // Scale up
  withSpring(1.0)    // Scale back
)

// Glow effect
glowOpacity.value = withSequence(
  withTiming(1, { duration: 100 }),   // Fade in
  withTiming(0, { duration: 300 })    // Fade out
)
```

**Performance:**
- All animations run on UI thread (60fps)
- No bridge communication
- Worklet-based (compiled to native)

## 🎯 Key Design Decisions

### 1. Audio as Source of Truth

**Decision:** Use audio playback position for all timing.

**Why:**
- Audio timing is most reliable
- Consistent across devices
- Prevents drift over time
- Aligns with user's audio experience

**Alternative Considered:**
- `setInterval` (rejected: drift, inaccurate)
- `requestAnimationFrame` only (rejected: no audio sync)

### 2. Pre-computed Beat Timestamps

**Decision:** Calculate all beat times upfront.

**Why:**
- Consistent timing
- No runtime calculations
- Supports BPM ramping
- Easy to debug

**Trade-off:**
- Uses more memory (negligible for 16 beats)
- Less flexible for dynamic tempo changes

### 3. Event-Driven Architecture

**Decision:** GameEngine uses event emitters.

**Why:**
- Decouples game logic from UI
- Easy to test engine independently
- Multiple listeners possible
- Clear separation of concerns

**Example:**
```typescript
engine.on('judgement', (data) => {
  // UI updates
  setJudgement(data.judgement)
  // Haptics
  Haptics.notificationAsync(...)
  // Audio
  playSound(data.judgement)
})
```

### 4. Expo Router (File-based Routing)

**Decision:** Use Expo Router instead of React Navigation.

**Why:**
- Simpler routing setup
- File-based conventions
- Type-safe navigation
- Web support built-in

**Structure:**
```
app/
  index.tsx       → /
  game.tsx        → /game
  settings.tsx    → /settings
```

### 5. Calibration System

**Decision:** Optional user calibration for device latency.

**Why:**
- Different devices have different audio latency
- Bluetooth headphones add delay
- Touch latency varies by device
- Improves fairness

**How it works:**
1. Play metronome for 8 beats
2. User taps on each beat
3. Calculate average offset
4. Apply to all future judgements

## 🎨 UI/UX Decisions

### 1. Color Palette

**Vibrant, High-Contrast:**
- Background: Dark navy (`#1a1a2e`)
- Primary: Electric lime (`#c9ff00`)
- Secondary: Hot coral (`#ff006e`)
- Success: Bright mint (`#06ffa5`)

**Why:**
- High contrast for readability
- Eye-catching (viral appeal)
- Distinct feedback colors
- Works in bright/dark environments

### 2. Emoji-Based Graphics

**Decision:** Use emoji for card images initially.

**Why:**
- Zero asset creation time
- Works on all platforms
- Recognizable symbols
- Easy to customize

**Future:** Replace with custom illustrations.

### 3. Haptic Feedback

**Decision:** Haptics on every beat + judgement.

**Why:**
- Tactile confirmation
- Helps with timing feel
- Increases satisfaction
- Modern game standard

**Implementation:**
```typescript
// Light tap on beat
Haptics.impactAsync(ImpactFeedbackStyle.Light)

// Strong feedback on perfect
Haptics.notificationAsync(NotificationFeedbackType.Success)
```

## 🚀 Performance Optimizations

### 1. Reanimated for 60fps

All animations use Reanimated worklets:
```typescript
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}))
```

**Benefit:** Animations never drop below 60fps.

### 2. Minimal Re-renders

GameEngine state updates throttled to 10Hz:
```typescript
setInterval(() => {
  setGameState(engine.getState())
}, 100) // Update UI 10x per second
```

**Benefit:** Smooth gameplay, no jank.

### 3. Efficient Event System

Game events use callbacks instead of state updates:
```typescript
engine.on('beat', (data) => {
  // Direct update, no re-render
  setTargetIndex(data.targetIndex)
})
```

### 4. Audio Pre-loading

Audio loaded before game starts:
```typescript
const { sound } = await Audio.Sound.createAsync(audioFile)
await sound.playAsync()
```

**Benefit:** No mid-game loading delays.

## 🧪 Testing Strategy

### Unit Tests (Recommended)

Test pure functions:
```typescript
// BeatScheduler.test.ts
test('judges perfect timing correctly', () => {
  const scheduler = new BeatScheduler(120, config)
  scheduler.initialize(0)
  const result = scheduler.judgeInput(80, 0) // Within perfect window
  expect(result).toBe('perfect')
})
```

### Integration Tests

Test GameEngine events:
```typescript
test('emits game-over when lives reach 0', async () => {
  const engine = new GameEngine(pack)
  let gameOverCalled = false
  engine.on('game-over', () => { gameOverCalled = true })
  // Simulate 3 misses...
  expect(gameOverCalled).toBe(true)
})
```

### Manual Testing

Checklist:
- [ ] Beat timing feels tight
- [ ] Calibration improves accuracy
- [ ] Animations smooth (60fps)
- [ ] Audio syncs correctly
- [ ] Score persists after restart

## 🔧 Extension Points

### Adding New Input Modes

1. Create input handler class
2. Register with GameEngine
3. Call `engine.handleInput(word)` on detection

### Adding New Rhyme Packs

Edit `src/data/packs.json`:
```json
{
  "id": "unique-id",
  "name": "Pack Name",
  "difficulty": "easy|medium|hard",
  "bpmStart": 90,
  "items": [...]
}
```

### Adding Online Leaderboards

1. Create API client service
2. Add to `useGameStore`
3. Submit scores on game end
4. Display in results screen

### Adding Multiplayer

Architecture supports it:
1. Sync game seed between players
2. Share `GameEngine` events
3. Display both players' results

## 📊 Data Flow

```
User Tap
   │
   ▼
GameEngine.handleInput()
   │
   ├──► Get audio position
   ├──► BeatScheduler.judgeInput()
   ├──► Calculate score
   ├──► Update state
   │
   ▼
Emit 'judgement' event
   │
   ├──► UI: Show feedback
   ├──► Haptics: Vibrate
   └──► Audio: Play SFX
```

## 🔐 Security Considerations

- **No server communication** - All local
- **No user data collection** - Privacy-first
- **No analytics tracking** - User owns their data
- **Microphone permission** - Only for voice mode, clearly explained

## 📈 Scalability

**Current:**
- 4 rhyme packs
- 32 words
- Local high scores

**Future:**
- 50+ packs
- 1000+ words
- Cloud sync
- Social features
- Custom pack creator

**Architecture supports:**
- Pack pagination
- Lazy loading
- Cloud storage
- User-generated content

## 🎓 Learning Resources

Key technologies used:
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## 💡 Future Improvements

1. **Difficulty Modes**
   - Easy: 80 BPM start
   - Normal: 100 BPM start
   - Hard: 120 BPM start

2. **Power-ups**
   - Slow-mo (reduce BPM temporarily)
   - Shield (extra life)
   - Freeze (pause difficulty ramp)

3. **Visual Themes**
   - Light mode
   - Neon mode
   - Retro mode

4. **Sound Packs**
   - Electronic beats
   - Acoustic drums
   - Hip-hop style

---

**This architecture balances performance, maintainability, and viral appeal. Happy coding! 🎵**
