# Code Conventions & Guidelines

## Romaji vs Romanji Spelling Convention

### Important: Two Different Spellings for Different Contexts

The codebase uses **TWO different spellings** of the Japanese romanization term:

### 1. Data Layer: `romanji` (with 'n')

Used in all data structures, JSON files, TypeScript interfaces, and code variables.

**Why?** The original JSON dataset used `romanji` as the field name. Changing this would require:
- Rewriting all JSON files (1000+ entries)
- Updating all TypeScript interfaces
- Refactoring all code that accesses this field
- Risk of breaking existing functionality

**Where to use `romanji`:**
```typescript
// ✅ JSON field names
{
  "word": "お腹",
  "kana": "おなか",
  "romanji": ["onaka"],  // ← Use 'romanji' here
  "meaning": "stomach"
}

// ✅ TypeScript interfaces
export interface VocabularyWord {
  word: string;
  kana: string;
  romanji: string[];  // ← Use 'romanji' here
  meaning: string;
}

// ✅ Code variables and properties
const word = vocabulary[0];
const readings = word.romanji;  // ← Use 'romanji' here
if (word.romanji.includes(answer)) { ... }
```

### 2. User Interface: `romaji` (no 'n')

Used in all user-facing text, labels, placeholders, and instructions.

**Why?** The correct English spelling of Japanese ローマ字 (rōmaji) is **"romaji"** without the 'n'. Using the correct spelling in the UI provides:
- Professional appearance
- Consistency with Japanese learning resources
- Correct terminology for users

**Where to use `romaji`:**
```tsx
// ✅ UI placeholders
<TextInput
  placeholder="Type romaji here..."  // ← Use 'romaji' here
/>

// ✅ UI labels and instructions
<Text>What is the romaji?</Text>  // ← Use 'romaji' here
<Text>Type the romaji for this character</Text>  // ← Use 'romaji' here

// ✅ User-facing documentation
"Enter the romaji reading..."  // ← Use 'romaji' here
```

### Summary

| Context | Spelling | Example |
|---------|----------|---------|
| JSON field names | `romanji` | `"romanji": ["onaka"]` |
| TypeScript interfaces | `romanji` | `romanji: string[]` |
| Code variables | `romanji` | `word.romanji` |
| UI text (placeholders) | `romaji` | `placeholder="Type romaji"` |
| UI text (labels) | `romaji` | `<Text>What is the romaji?</Text>` |
| UI text (instructions) | `romaji` | `"Type the romaji for..."` |

### Quick Reference

```typescript
// ❌ WRONG - Don't use romaji (no 'n') in data/code
interface Vocabulary {
  romaji: string[];  // ❌ Wrong
}

// ✅ CORRECT - Use romanji (with 'n') in data/code
interface Vocabulary {
  romanji: string[];  // ✅ Correct
}

// ❌ WRONG - Don't use romanji (with 'n') in UI
<Text>What is the romanji?</Text>  // ❌ Wrong

// ✅ CORRECT - Use romaji (no 'n') in UI
<Text>What is the romaji?</Text>  // ✅ Correct
```

### Why This Matters

This convention prevents confusion between:
1. **Technical consistency** - keeping data structure names consistent
2. **User experience** - showing correct terminology to learners

### When Adding New Features

- **Adding new data fields?** → Use `romanji` (with 'n')
- **Adding new UI text?** → Use `romaji` (no 'n')
- **Writing code logic?** → Use `romanji` (with 'n') for data access
- **Writing user messages?** → Use `romaji` (no 'n') for display

---

**Last Updated:** 2026-01-11
**Applies To:** Web (`japanese`) and Mobile (`japanese-mobile-claude`) codebases
