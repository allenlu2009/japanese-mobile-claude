# Japanese Learning Lab - Mobile App (Claude's Implementation)

A mobile companion app for Japanese language learning built with **React Native + Expo SDK 54**.

## 🚀 Quick Start

```bash
# Navigate to project
cd /home/allen/projects/japanese-mobile-claude

# Start development server (WSL2 - use tunnel!)
npx expo start --tunnel -c

# Run on device with Expo Go
# 1. Install Expo Go from Play Store
# 2. Wait for QR code to appear in terminal
# 3. Scan QR code with Expo Go app
```

**Important for WSL2 Users:**
- Always use `--tunnel` flag to make dev server accessible from your phone
- Use `-c` to clear cache on startup
- Tunnel takes ~10-15 seconds to connect

## ✅ Current Status

**Phase 1: Foundation - COMPLETE**
- ✅ Expo SDK 54.0.31 (latest stable)
- ✅ React Native 0.81.5 (New Architecture)
- ✅ React 19.1.0
- ✅ Expo Router v6 (file-based routing)
- ✅ NativeWind v4 (Tailwind CSS v3)
- ✅ 4-tab navigation configured
- ✅ All web business logic copied (22 files)
- ✅ All datasets copied (266KB JLPT data)

**Phase 2: Database & Import - TODO**
- ⏳ SQLite database schema
- ⏳ Storage abstraction layer
- ⏳ High-tolerance import parser
- ⏳ Import/Export UI

## 🎯 Technology Stack

### Core
- **Expo SDK**: 54.0.31
- **React Native**: 0.81.5 (New Architecture enabled)
- **React**: 19.1.0
- **TypeScript**: 5.9.2

### Navigation & Routing
- **Expo Router**: v6.0.21 (file-based, like Next.js)

### Styling
- **NativeWind**: v4
- **Tailwind CSS**: 3.4.19 (v3 required by NativeWind)
- **Lucide Icons**: lucide-react-native

### Storage & Data
- **expo-sqlite**: ~15.1.0 (SQLite database)
- **@react-native-async-storage**: 1.23.1
- **expo-file-system**: ~18.0.0

### Mobile Features
- **expo-speech**: ~13.0.1 (Text-to-Speech)
- **expo-haptics**: ~14.0.0 (Haptic feedback)
- **expo-document-picker**: ~13.0.0 (File picker)
- **expo-sharing**: ~13.0.0 (Share API)

### Utilities
- **date-fns**: ^4.1.0 (Date utilities)
- **wanakana**: ^5.3.1 (Romanji conversion)

## 📁 Project Structure

```
japanese-mobile-claude/
├── app/                          # Expo Router v6
│   ├── _layout.tsx              ✅ Root layout
│   └── (tabs)/                  ✅ Tab navigation
│       ├── _layout.tsx          ✅ 4 tabs (Overview, Labs, Analytics, Data)
│       ├── index.tsx            ✅ Overview screen
│       ├── labs.tsx             ✅ Test Labs screen
│       ├── analytics.tsx        ✅ Analytics screen
│       └── data.tsx             ✅ Data Management screen
├── lib/                         ✅ Business logic (from web!)
│   ├── wanakanaAnalysis.ts     ✅ Answer analysis
│   ├── answerAnalysis.ts       ✅ Scoring engine
│   ├── testGenerator.ts        ✅ Test generation
│   ├── analytics.ts            ✅ Analytics
│   ├── types.ts                ✅ TypeScript types
│   └── ... (22 files total)    ✅ All web logic
├── data/                        ✅ Datasets (from web!)
│   └── processed/
│       ├── kanji-n4.json       ✅ 30KB
│       ├── kanji-n5.json       ✅ 15KB
│       ├── vocabulary-n4.json  ✅ 110KB
│       └── vocabulary-n5.json  ✅ 112KB
├── global.css                   ✅ Tailwind setup
├── tailwind.config.js           ✅ NativeWind config
├── metro.config.js              ✅ Metro bundler
├── app.json                     ✅ Expo config
└── package.json                 ✅ Dependencies
```

## 🔧 Configuration

### Android SDK Settings
- **minSdkVersion**: 23 (Android 6.0)
- **targetSdkVersion**: 34 (Android 14)
- **compileSdkVersion**: 34
- **newArchEnabled**: true

### Tailwind/NativeWind
- Using Tailwind CSS **v3.4.19** (NativeWind v4 requirement)
- Configuration in `tailwind.config.js`
- Global styles in `global.css`
- Metro bundler configured with NativeWind plugin

## 🎨 Features

### Current (Placeholders)
- ✅ 4-tab bottom navigation
- ✅ Overview dashboard (placeholder)
- ✅ Test Labs (placeholder)
- ✅ Analytics (placeholder)
- ✅ Data Management (placeholder)

### Coming Soon
- ⏳ Import from web version (JSON files)
- ⏳ Export mobile data
- ⏳ Interactive Kana tests (Hiragana, Katakana)
- ⏳ JLPT Kanji tests (N5, N4)
- ⏳ Vocabulary tests (N5, N4)
- ⏳ Character-level analytics
- ⏳ Character heatmap (10x10 grid)
- ⏳ Study streak tracking
- ⏳ Haptic feedback
- ⏳ Text-to-Speech pronunciation

## 🚀 Code Reuse (~85%)

All business logic from the web version is ready to use:

### Test Generation
- `testGenerator.ts` - Core test generation
- `kanjiTestGenerator.ts` - Kanji tests
- `katakanaTestGenerator.ts` - Katakana tests
- `mixedTestGenerator.ts` - Mixed kana tests
- `vocabularyTestGenerator.ts` - Vocabulary tests

### Answer Analysis
- `wanakanaAnalysis.ts` - WanaKana-based scoring
- `answerAnalysis.ts` - Answer validation
- `syllableMatching.ts` - Syllable matching
- `romanjiNormalization.ts` - Romanji normalization

### Analytics
- `analytics.ts` - Core analytics
- `characterAnalytics.ts` - Character-level stats

### Data
- `hiragana.ts`, `katakana.ts` - Kana data loaders
- `kanji.ts`, `vocabulary.ts` - JLPT data loaders
- Complete N4/N5 datasets (1,386 words, 246 kanji)

## 🛠️ Development

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Start Development Server
```bash
# Default (port 8081)
npm start

# Specific port (avoid conflicts)
npx expo start --port 8083

# Clear cache
npx expo start --clear
```

### Run on Device
```bash
# Android emulator
npm run android

# iOS simulator (macOS only)
npm run ios

# Web (testing)
npm run web
```

### Build
```bash
# Development build
npx expo run:android

# Production APK
eas build --platform android --profile production
```

## ⚠️ Troubleshooting

### WSL2 - Phone Can't Connect
**Always use tunnel mode for WSL2:**
```bash
npx expo start --tunnel -c
```

The tunnel creates a secure connection between WSL2 and your phone over the internet.

### Port Conflict
If you see "Port 8081 is running in another window":
```bash
# Kill existing Expo processes
pkill -f "expo start"

# Then restart with tunnel
npx expo start --tunnel -c
```

### Tailwind CSS Version Error
NativeWind v4 requires Tailwind CSS v3, not v4:
```bash
npm install tailwindcss@3.4.19 --legacy-peer-deps
```

### Clear Cache
If you encounter bundling issues:
```bash
npx expo start --tunnel -c
# OR full clean:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npx expo start --tunnel -c
```

### Tunnel Connection Issues
If tunnel fails to connect:
1. Check your internet connection
2. Try restarting Expo: `Ctrl+C` then `npx expo start --tunnel -c`
3. Check firewall settings (allow Node.js)
4. Try LAN mode if on same WiFi: `npx expo start --lan`

## 📊 Progress

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Foundation | ✅ Complete | 100% |
| Phase 2: Database & Import | ⏳ Pending | 0% |
| Phase 3: Interactive Testing | ⏳ Pending | 0% |
| Phase 4: Analytics | ⏳ Pending | 0% |
| Phase 5: Polish & Release | ⏳ Pending | 0% |

**Overall**: ~20% (Foundation complete)

## 📝 Next Steps

1. **Create SQLite database schema**
   - Tests table
   - Character attempts table
   - Study streak table
   - Import history table
   - Settings table

2. **Build storage abstraction layer**
   - Test CRUD operations
   - Character attempt tracking
   - Streak management
   - Settings persistence

3. **Implement high-tolerance import parser**
   - Forward-compatible JSON parsing
   - Handles missing fields gracefully
   - Deduplication by ID
   - Error/warning reporting

4. **Build Import/Export UI**
   - File picker integration
   - Import from web version
   - Export mobile data
   - Import history display

5. **Build test screens**
   - Kana test configuration
   - Test question UI (60/40 single-hand layout)
   - Test results screen
   - Auto-save functionality

## 🔗 Related Directories

- **Web version**: `/home/allen/projects/japanese/`
- **Codex's mobile**: `/home/allen/projects/japanese-mobile-codex/`
- **Gemini's implementation**: `/home/allen/gdrive/gemini/japanese/`

## 📄 Documentation

- `SETUP_COMPLETE.md` - Detailed setup documentation
- `INITIAL_mobile_claude_v3_expo.md` - Original specification
- This `README.md` - Quick reference

## 🤝 Comparison

This is **Claude's implementation** using Expo SDK 54, separate from:
- **Codex's implementation** in `japanese-mobile-codex`
- **Gemini's recommendations** for React Native approach

All three are now using Expo SDK 54 with the same modern stack! 🎉

---

**Status**: ✅ Foundation Complete - Ready for Database Implementation
**Next**: Implement SQLite storage layer with import/export functionality
