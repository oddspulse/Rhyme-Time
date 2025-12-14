# Voice Mode Setup Guide

This guide explains how to enable voice recognition in Rhyme Time.

## ⚠️ Important Note

**Voice mode is NOT available in Expo Go** due to native module requirements. You must use a development build or create a production build.

## Why Voice Isn't Available by Default

Voice recognition requires native modules that can't run in the Expo Go sandbox:
- Microphone access
- Speech-to-text processing
- Native audio routing

These features require building native binaries.

## 🎯 Recommended Approach

### Option 1: Development Client (Best for Development)

A development client gives you the full Expo DX while supporting native modules.

#### Step 1: Install Dependencies

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Install voice recognition library
npm install @react-native-voice/voice

# For iOS, install pods
npx pod-install
```

#### Step 2: Configure Permissions

**iOS (ios/Info.plist):**
```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs access to your microphone for voice recognition.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app needs access to speech recognition to play the game.</string>
```

**Android (android/app/src/main/AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

#### Step 3: Prebuild

```bash
# Generate native projects
npx expo prebuild

# This creates ios/ and android/ directories
```

#### Step 4: Run Development Build

**iOS:**
```bash
npx expo run:ios
```

**Android:**
```bash
npx expo run:android
```

Your app now runs with a development client that supports voice!

### Option 2: EAS Build (Best for Production)

Use EAS to build production-ready apps with voice support.

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

#### Step 2: Configure EAS

```bash
eas build:configure
```

#### Step 3: Update eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

#### Step 4: Build

```bash
# Build development client for iOS
eas build --profile development --platform ios

# Build development client for Android
eas build --profile development --platform android

# Install on device when complete
```

## 🎤 Implementing Voice Recognition

### Step 1: Create Voice Service

Create `src/services/VoiceService.ts`:

```typescript
import Voice from '@react-native-voice/voice';

export class VoiceService {
  private onResult: ((words: string[]) => void) | null = null;

  constructor() {
    Voice.onSpeechResults = this.handleResults.bind(this);
    Voice.onSpeechError = this.handleError.bind(this);
  }

  async start(onResult: (words: string[]) => void) {
    this.onResult = onResult;
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice start error:', error);
    }
  }

  async stop() {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Voice stop error:', error);
    }
  }

  private handleResults(event: any) {
    if (event.value && this.onResult) {
      this.onResult(event.value);
    }
  }

  private handleError(event: any) {
    console.error('Voice error:', event.error);
  }

  async destroy() {
    await Voice.destroy();
  }
}
```

### Step 2: Update Game Screen

In `app/game.tsx`, add voice integration:

```typescript
import { VoiceService } from '../src/services/VoiceService';

// ... inside GameScreen component

const voiceServiceRef = useRef<VoiceService | null>(null);
const inputMode = useGameStore((state) => state.settings.inputMode);

useEffect(() => {
  if (inputMode === 'voice') {
    voiceServiceRef.current = new VoiceService();

    voiceServiceRef.current.start((words) => {
      // Handle recognized words
      if (words.length > 0 && gameEngineRef.current) {
        gameEngineRef.current.handleInput(words[0]);
      }
    });
  }

  return () => {
    if (voiceServiceRef.current) {
      voiceServiceRef.current.destroy();
    }
  };
}, [inputMode]);
```

### Step 3: Request Permissions

Add permission handling:

```typescript
import { PermissionsAndroid, Platform } from 'react-native';

async function requestMicrophonePermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'Rhyme Time needs access to your microphone for voice mode.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}
```

### Step 4: Enable Voice Mode in UI

Update `app/mode-select.tsx`:

```typescript
<Button
  title="PLAY VOICE"
  onPress={() => handleModeSelect('voice')}
  variant="outline"
  size="medium"
  disabled={false} // Enable the button
/>
```

## 🧪 Testing Voice Mode

### 1. Build and Install

```bash
npx expo run:ios
# or
npx expo run:android
```

### 2. Test Flow

1. Launch app
2. Select voice mode
3. Grant microphone permission
4. Start game
5. Say the word on beat
6. Verify recognition works

### 3. Common Issues

**Voice not recognized:**
- Ensure microphone permission granted
- Speak clearly and loudly
- Check background noise
- Verify voice service is running

**Delayed recognition:**
- Voice-to-text has ~200-500ms latency
- May need to adjust timing windows
- Consider pre-processing or prediction

**Recognition errors:**
- Some words sound similar (near/deer)
- Add phonetic hints in pack data
- Consider fuzzy matching

## 🎯 Optimization Tips

### 1. Continuous Recognition

Keep voice recognition running throughout the round:

```typescript
// In GameEngine.ts
async startVoiceMode(voiceService: VoiceService) {
  voiceService.start((words) => {
    const word = words[0];
    this.handleInput(word);
  });
}
```

### 2. Word Matching

Improve matching with phonetic similarity:

```typescript
function matchWord(recognized: string, expected: string): boolean {
  // Normalize
  const norm1 = recognized.toLowerCase().trim();
  const norm2 = expected.toLowerCase().trim();

  // Direct match
  if (norm1 === norm2) return true;

  // Phonetic match (add library like 'natural')
  // Example: 'deer' matches 'dear'

  return false;
}
```

### 3. Feedback

Add voice-specific feedback:

```typescript
// Show what was heard
<Text>You said: "{recognizedWord}"</Text>
```

## 📱 Platform Differences

### iOS
- ✅ Better accuracy
- ✅ Faster recognition
- ⚠️ Requires speech recognition permission
- ⚠️ Privacy popup on first use

### Android
- ✅ Works well
- ⚠️ May vary by device
- ⚠️ Needs Google Speech Services
- ⚠️ Microphone permission required

## 🚀 Production Deployment

### 1. Privacy Policy

Add speech recognition to your privacy policy:
> "We use on-device speech recognition to enable voice gameplay. No voice data is stored or transmitted."

### 2. App Store Notes

**iOS (App Store Connect):**
- Explain microphone usage in description
- NSMicrophoneUsageDescription required

**Android (Play Console):**
- Declare RECORD_AUDIO permission
- Explain usage in privacy section

### 3. Fallback

Always provide tap mode as fallback:
- Not all devices support voice
- Users may prefer tap mode
- Privacy-conscious users

## 📚 Additional Resources

- [@react-native-voice/voice docs](https://github.com/react-native-voice/voice)
- [Expo dev client guide](https://docs.expo.dev/development/introduction/)
- [EAS Build docs](https://docs.expo.dev/build/introduction/)

## ❓ FAQ

**Q: Can I test voice in Expo Go?**
A: No, you must build a development client.

**Q: Does it work offline?**
A: Yes! On-device speech recognition works offline on most devices.

**Q: What languages are supported?**
A: Depends on device. The game currently uses English ('en-US').

**Q: How accurate is it?**
A: 85-95% accuracy for clear speech in quiet environments.

---

**Ready to implement voice mode? Follow the steps above and enable the ultimate viral gameplay experience!** 🎤
