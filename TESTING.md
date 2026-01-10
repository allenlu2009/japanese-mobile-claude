# Testing Checklist for Japanese Learning Mobile App

## ✅ Core Features Implemented

### 1. Database & Storage
- [x] SQLite database with 5 tables (tests, character_attempts, study_streak, import_history, app_settings)
- [x] Storage abstraction layer matching web API
- [x] Proper foreign key constraints (test_id in character_attempts)
- [x] Transaction safety for imports
- [x] Auto-cleanup with CASCADE deletes

### 2. Practice Tab (Home)
- [x] Test type selection (Hiragana, Katakana, Kanji, Vocabulary)
- [x] Question count selection (5, 10, 20, 30, custom)
- [x] Recent tests display
- [x] Study streak display

### 3. Test Functionality
- [x] Generate questions using correct test generators
- [x] UUID generation with react-native-get-random-values
- [x] Real-time answer validation
- [x] Progress tracking
- [x] Character attempt saving with test_id
- [x] Test result saving
- [x] Streak updates on completion

### 4. Analytics Tab
- [x] Overall statistics (total tests, average score)
- [x] Study streak tracking
- [x] Activity stats (last 7/30 days)
- [x] Tests by type breakdown
- [x] Recent test history
- [x] Empty state for new users

### 5. Data Tab
- [x] Import from web (JSON file picker)
- [x] High-tolerance JSON parser
- [x] Export to file (sharing)
- [x] Import history tracking
- [x] Current data statistics

### 6. Settings Tab
- [x] Test preferences (hints, auto-advance)
- [x] Audio/haptics toggles
- [x] Data management (clear all)
- [x] Storage statistics
- [x] About section

### 7. Audio Features
- [x] Text-to-Speech for Japanese characters
- [x] Auto-play on question load
- [x] Manual replay with 🔊 button
- [x] Success/error haptic feedback
- [x] Sound/haptics respect settings toggles

## 🧪 Manual Testing Checklist

### Before Testing
- [ ] Expo server running with tunnel mode (`npx expo start --tunnel -c`)
- [ ] Phone connected to Expo Go app
- [ ] Fresh database (or known state)

### Test Flow 1: First Time User
1. [ ] Open app - should see Practice tab with 0 tests
2. [ ] Navigate to Analytics - should see "No data yet" empty state
3. [ ] Navigate to Settings - should show 0 tests, 0 attempts
4. [ ] Navigate to Data - should show 0 tests, 0 attempts

### Test Flow 2: Take Hiragana Test
1. [ ] Go to Practice tab
2. [ ] Select "Hiragana" test type (should highlight blue)
3. [ ] Select "5" questions
4. [ ] Click "Start Test"
5. [ ] Verify: Progress shows "Question 1 of 5"
6. [ ] Verify: Large hiragana character displays
7. [ ] Type correct romanji answer (e.g., "a" for "あ")
8. [ ] Click "Check Answer"
9. [ ] Verify: Green feedback shows "✅ Correct!"
10. [ ] Click "Next Question"
11. [ ] Repeat for all 5 questions
12. [ ] Verify: Last question shows "Finish Test" button
13. [ ] Click "Finish Test"
14. [ ] Verify: Results screen shows score percentage
15. [ ] Verify: Statistics show correct/incorrect counts
16. [ ] Click "Take Another Test"
17. [ ] Verify: Returns to Practice tab

### Test Flow 3: Take Katakana Test
1. [ ] Select "Katakana" test type (should highlight purple)
2. [ ] Select "10" questions
3. [ ] Complete test with some wrong answers
4. [ ] Verify: Incorrect answers show red feedback
5. [ ] Verify: Correct answer displayed for wrong answers
6. [ ] Verify: Score reflects actual performance

### Test Flow 3b: Take Kanji Test
1. [ ] Select "Kanji" test type (should highlight green)
2. [ ] Select "5" questions
3. [ ] Verify: Test loads successfully (not stuck)
4. [ ] Verify: Kanji characters display correctly
5. [ ] Verify: Audio speaks kanji character
6. [ ] Complete test
7. [ ] Verify: Results show correctly

### Test Flow 3c: Take Vocabulary Test
1. [ ] Select "Vocabulary" test type (should highlight orange)
2. [ ] Select "5" questions
3. [ ] Verify: Test loads successfully
4. [ ] Verify: Japanese words display correctly
5. [ ] Verify: Audio speaks vocabulary words
6. [ ] Complete test
7. [ ] Verify: Results show correctly

### Test Flow 4: Analytics Update
1. [ ] Navigate to Analytics tab
2. [ ] Verify: "Total Tests" shows 2
3. [ ] Verify: Average score is calculated correctly
4. [ ] Verify: "Last 7 days" shows 2
5. [ ] Verify: "Tests by Type" shows Hiragana and Katakana
6. [ ] Verify: Recent tests list shows both tests with scores

### Test Flow 5: Study Streak
1. [ ] Complete another test
2. [ ] Verify: Streak appears on Practice tab (🔥 1 day streak)
3. [ ] Verify: Streak appears on Analytics tab

### Test Flow 6: Data Import
1. [ ] Export data from web version (if available)
2. [ ] Navigate to Data tab
3. [ ] Click "Browse Files"
4. [ ] Select exported JSON file
5. [ ] Verify: Import success message shows counts
6. [ ] Verify: Import history shows entry
7. [ ] Verify: Test count updated

### Test Flow 7: Data Export
1. [ ] Navigate to Data tab
2. [ ] Click "Export Data"
3. [ ] Verify: Share dialog appears
4. [ ] Verify: Can save/share file

### Test Flow 8: UI Layout with Keyboard
1. [ ] Start a new Hiragana test
2. [ ] Verify: "WHAT IS THE ROMANJI?" text is at top
3. [ ] Verify: Character and 🔊 button are side-by-side
4. [ ] Tap the input field
5. [ ] Verify: Keyboard appears
6. [ ] Verify: Character and speaker icon still visible above keyboard
7. [ ] Verify: Input field visible above keyboard
8. [ ] Type answer and submit
9. [ ] Verify: Feedback message visible above keyboard
10. [ ] Verify: "Next Question" button visible and tappable

### Test Flow 9: Audio & Haptics
1. [ ] Start a new Hiragana test
2. [ ] Verify: Character is spoken automatically on load
3. [ ] Verify: Tap 🔊 button to hear character again
4. [ ] Answer correctly
5. [ ] Verify: Success haptic vibration
6. [ ] Answer incorrectly on next question
7. [ ] Verify: Error haptic vibration (different pattern)
8. [ ] Go to Settings
9. [ ] Toggle "Sound Effects" off
10. [ ] Start new test
11. [ ] Verify: No audio plays
12. [ ] Verify: 🔊 button is hidden
13. [ ] Toggle "Haptic Feedback" off
14. [ ] Verify: No vibrations on correct/incorrect

### Test Flow 9: Settings Persistence
1. [ ] Navigate to Settings tab
2. [ ] Toggle "Show Hints" off
3. [ ] Toggle "Auto Advance" on
4. [ ] Toggle "Sound Effects" off
5. [ ] Close app completely
6. [ ] Reopen app
7. [ ] Navigate to Settings
8. [ ] Verify: All toggles remain as set
9. [ ] Verify: Sound still disabled in new test
10. [ ] Verify: Storage stats show correct counts

### Test Flow 10: Clear Data
1. [ ] In Settings, click "Clear All Data"
2. [ ] Verify: Confirmation dialog appears
3. [ ] Click "Clear Data"
4. [ ] Verify: Success message
5. [ ] Verify: All tabs show empty state
6. [ ] Verify: Storage shows 0 tests, 0 attempts

## 🐛 Known Issues Fixed

1. ✅ NativeWind styles not rendering - Fixed babel.config.js preset order
2. ✅ UUID generation failing - Added react-native-get-random-values
3. ✅ Test generator import errors - Fixed to use correct generator functions
4. ✅ Character attempts NOT NULL error - Fixed to save with test_id at completion
5. ✅ react-native-reanimated missing - Added as NativeWind dependency
6. ✅ saveSettings not a function - Added missing function to settingsStorage
7. ✅ Audio muting after first character - Fixed settings loading order
8. ✅ Input/output blocked by keyboard - Moved layout to top with speaker icon beside character
9. ✅ Kanji test stuck at loading - Fixed parameter order in generateKanjiQuestions()
10. ✅ Vocabulary test stuck at loading - Fixed parameter order in generateVocabularyQuestions()
11. ✅ TTS crash on undefined text - Added validation in speakJapanese()

## 🔍 Error Scenarios to Test

1. [ ] Import invalid JSON file - should show error
2. [ ] Import JSON with missing fields - should show warnings
3. [ ] Take test with 0 questions - should prevent (but worth testing)
4. [ ] Network interruption during import - should handle gracefully
5. [ ] Database corruption - app should init new DB

## 📊 Performance Checks

1. [ ] Test generation < 500ms for 30 questions
2. [ ] Database queries < 100ms for 100 tests
3. [ ] UI remains responsive during test
4. [ ] Smooth animations and transitions
5. [ ] No memory leaks during extended use

## 🎯 Success Criteria

- ✅ All 4 test types generate questions correctly
- ✅ Answers validated accurately
- ✅ Data persists between app sessions
- ✅ Import/export compatible with web version
- ✅ Analytics accurately reflect test history
- ✅ Audio plays for all characters throughout test
- ✅ Haptic feedback works on correct/incorrect answers
- ✅ Settings persist and affect behavior correctly
- ✅ No crashes during normal usage
- ✅ UI is polished and responsive
