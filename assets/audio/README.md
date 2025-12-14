# Audio Assets

## Required Files

This directory needs beat loop audio files for the game to work properly.

### Required Files:
- `beat-loop-1.mp3` - Primary beat loop (used in gameplay)
- `beat-loop-2.mp3` - Optional alternative beat
- `beat-loop-3.mp3` - Optional alternative beat

## Where to Get Beat Loops

### Free Resources:
1. **Pixabay Music** - https://pixabay.com/music/
   - Search: "metronome" or "drum loop"
   - License: Free for commercial use

2. **FreeSounds.org** - https://freesound.org/
   - Search: "120 bpm loop" or "metronome"
   - Requires attribution (check license)

3. **YouTube Audio Library** - https://studio.youtube.com/
   - Navigate to Audio Library
   - Filter by "Beats" genre

4. **Zapsplat** - https://www.zapsplat.com/
   - Free sound effects and loops

### Create Your Own:

#### GarageBand (Mac/iOS):
1. Open GarageBand
2. Create "Drummer" track
3. Set tempo to 90-120 BPM
4. Export as MP3

#### Online Beat Maker:
1. Visit https://www.beatsbydrewpeacock.com/ or similar
2. Create simple metronome pattern
3. Download as MP3

## Technical Requirements

Your beat loops should meet these specs:

- **Format:** MP3 (AAC also works)
- **Sample Rate:** 44.1kHz (standard)
- **Bit Rate:** 128-320 kbps
- **Length:** 4-8 bars minimum (for seamless looping)
- **BPM:** 90-120 recommended for starter beats
- **Loopable:** Must loop seamlessly (no gaps/clicks)

## Quick Setup

Once you have your audio files:

```bash
# Copy your beat loops to this directory
cp /path/to/your/beat-loop-1.mp3 ./beat-loop-1.mp3
cp /path/to/your/beat-loop-2.mp3 ./beat-loop-2.mp3
cp /path/to/your/beat-loop-3.mp3 ./beat-loop-3.mp3

# Verify files are present
ls -lh
```

## Testing Your Beats

1. Start the app: `npx expo start`
2. Navigate to gameplay
3. Listen for clear, consistent beats
4. Adjust calibration if timing feels off

## Placeholder Solution

If you don't have audio files yet, the app will fail to load. You can:

1. Download a simple metronome MP3 from the sources above
2. Use a placeholder (silence or simple click track)
3. Create a basic beat in any music software

## Need Help?

Check the main README.md for more detailed setup instructions.
