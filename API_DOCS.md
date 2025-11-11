# Cowtion API & Integration Documentation

## Overview

Cowtion integrates with three main services:
1. **Firebase** - Database and Storage
2. **Google Generative AI (Gemini)** - Image analysis
3. **Leaflet** - Map visualization

## 🔥 Firebase Integration

### Database Operations (`src/lib/db.ts`)

#### `uploadCattleReport(report, imageBlob)`
Uploads a cattle report with image to Firebase.

**Parameters:**
- `report`: Omit<CattleReport, 'id'>
- `imageBlob`: Blob

**Returns:** Promise<string> - Document ID

**Example:**
```typescript
const reportId = await uploadCattleReport(
  {
    latitude: 37.7749,
    longitude: -122.4194,
    cowCount: 5,
    roadCondition: 'Moderate',
    description: 'Cattle crossing highway',
    uploadedBy: 'user123',
    timestamp: Date.now(),
    imageUrl: '',
    upvotes: 0,
    downvotes: 0,
  },
  imageBlob
);
```

#### `getCattleReportsNearby(latitude, longitude, radiusInKm)`
Fetches cattle reports within a radius.

**Parameters:**
- `latitude`: number
- `longitude`: number
- `radiusInKm`: number (default: 5)

**Returns:** Promise<CattleReport[]>

**Example:**
```typescript
const reports = await getCattleReportsNearby(37.7749, -122.4194, 10);
```

#### `getCattleReport(reportId)`
Fetches a specific report.

**Parameters:**
- `reportId`: string

**Returns:** Promise<CattleReport | null>

#### `upvoteCattleReport(reportId)`
Increments upvote count.

**Parameters:**
- `reportId`: string

**Returns:** Promise<void>

#### `downvoteCattleReport(reportId)`
Increments downvote count.

**Parameters:**
- `reportId`: string

**Returns:** Promise<void>

#### `getAllCattleReports()`
Fetches all reports.

**Returns:** Promise<CattleReport[]>

---

## 🤖 Google Generative AI Integration

### AI Analysis (`src/lib/aiAnalysis.ts`)

#### `analyzeImageForCattle(imageData: Blob)`
Analyzes image using Gemini AI for cattle detection.

**Parameters:**
- `imageData`: Blob - Image blob

**Returns:** Promise<AIAnalysisResult>

**Response Schema:**
```typescript
{
  cowCount: number;           // Count of detected cattle
  roadCondition: "Good" | "Moderate" | "Poor";
  description: string;        // Hazard description
}
```

**Example:**
```typescript
const analysis = await analyzeImageForCattle(imageBlob);
// Returns:
// {
//   cowCount: 5,
//   roadCondition: 'Moderate',
//   description: 'Cattle on right shoulder, heavy traffic'
// }
```

**Fallback Behavior:**
If API key is missing or request fails, returns mock data:
```typescript
{
  cowCount: Math.random() * 10 + 1,
  roadCondition: "Good|Moderate|Poor",
  description: "Cattle detected on road. Exercise caution..."
}
```

---

## 📸 Image Processing

### Image Compression (`src/lib/imageCompression.ts`)

#### `compressImage(file, maxWidthOrHeight)`
Compresses image using browser-image-compression.

**Parameters:**
- `file`: File
- `maxWidthOrHeight`: number (default: 1200)

**Options:**
- Max file size: 0.5MB
- Max dimensions: 1200px
- Uses Web Workers for background processing

**Returns:** Promise<File>

**Example:**
```typescript
const compressedFile = await compressImage(imageFile);
console.log(`Original: ${file.size}, Compressed: ${compressedFile.size}`);
```

#### `getCompressedImageData(file)`
Gets compression statistics.

**Returns:**
```typescript
{
  blob: Blob;
  originalSize: number;
  compressedSize: number;
}
```

#### `formatFileSize(bytes)`
Formats file size for display.

**Example:**
```typescript
formatFileSize(500000) // "488.28 KB"
```

---

## 🗺️ Map Integration

### Leaflet Map Component (`src/components/Map.tsx`)

```typescript
<Map
  userLocation={{ latitude, longitude }}
  cattleReports={reports}
  onMarkerClick={(report) => handleClick(report)}
/>
```

**Features:**
- Real-time map rendering
- Color-coded density markers
- Interactive popups
- Automatic icon loading

**Density Calculation:**
- Analyzes cattle reports within 0.1 degree radius
- Calculates intensity score
- Maps to color gradient:
  - Red (#dc2626): > 66% intensity
  - Orange (#f97316): 33-66% intensity
  - Amber (#fbbf24): < 33% intensity

---

## 📱 State Management

### Zustand Store (`src/store/cowStore.ts`)

```typescript
const {
  // Location state
  userLocation,
  setUserLocation,
  
  // Reports state
  cattleReports,
  setCattleReports,
  addCattleReport,
  
  // UI state
  selectedReport,
  setSelectedReport,
  isLoading,
  setIsLoading,
  
  // Voting state
  userVotes,
  setUserVote,
} = useCowStore();
```

---

## 🔐 Authentication & Authorization

### Current Setup
- Anonymous access (no authentication)
- Read-only for anonymous users
- Write access with basic validation

### Production Recommendations
1. Implement Firebase Authentication
2. Add user profiles
3. Rate limiting per user
4. Content moderation system
5. Report abuse mechanism

---

## ⚙️ Environment Variables

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=                    # Web API Key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=               # Auth Domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=                # Project ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=            # Storage Bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=       # Sender ID
NEXT_PUBLIC_FIREBASE_APP_ID=                    # App ID

# Google Generative AI
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY=           # Gemini API Key
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to client-side code.

---

## 📊 Data Flow Diagram

```
User Upload
    ↓
Image Compression
    ↓
Geolocation Capture
    ↓
AI Analysis (Gemini)
    ↓
Firebase Upload
    ├── Storage (Image)
    └── Firestore (Metadata)
    ↓
Real-time Map Update
    ↓
User View & Vote
    ↓
Vote Increment in Firestore
```

---

## 🚨 Error Handling

### Image Upload Errors
```typescript
try {
  const reportId = await uploadCattleReport(report, imageBlob);
} catch (error) {
  console.error('Upload failed:', error);
  // Display user-friendly error
}
```

### AI Analysis Fallback
```typescript
const analysis = await analyzeImageForCattle(imageBlob);
// Falls back to mock data if:
// - API key missing
// - Network error
// - API rate limit exceeded
```

### Firebase Errors
Common Firebase errors:
- `auth/invalid-api-key` - Check API key
- `permission-denied` - Check security rules
- `quota-exceeded` - Upgrade Firebase plan

---

## 🎯 Integration Examples

### Complete Upload Flow
```typescript
// 1. Get user location
const location = await getUserLocation();

// 2. Get image from user
const imageFile = await captureImage();

// 3. Compress image
const compressedFile = await compressImage(imageFile);

// 4. Analyze with AI
const analysis = await analyzeImageForCattle(compressedFile);

// 5. Upload to Firebase
const reportId = await uploadCattleReport(
  {
    latitude: location.latitude,
    longitude: location.longitude,
    cowCount: analysis.cowCount,
    roadCondition: analysis.roadCondition,
    description: analysis.description,
    uploadedBy: userId,
    timestamp: Date.now(),
    imageUrl: '',
    upvotes: 0,
    downvotes: 0,
  },
  compressedFile
);

// 6. Update local state
store.addCattleReport(newReport);

// 7. Refresh map
loadReportsNearby();
```

### Vote Flow
```typescript
// User clicks upvote
await upvoteCattleReport(reportId);

// Update UI
setUserVote(reportId, 'up');

// Reload report for updated count
const updatedReport = await getCattleReport(reportId);
setSelectedReport(updatedReport);
```

---

## 📈 Performance Metrics

### Image Processing
- Compression: ~100-500ms
- Upload: ~1-5s (depends on network)
- AI Analysis: ~2-8s

### Database Operations
- Read nearby reports: ~500ms - 2s
- Write new report: ~1-3s
- Vote operation: ~100-500ms

### Map Rendering
- Initial load: ~1-2s
- Marker update: ~50-200ms
- Zoom/pan: ~100ms

---

## 🔧 Troubleshooting Integration

### Gemini API Not Responding
```typescript
// Check in browser DevTools
console.log(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY);
// Should not be undefined
```

### Firebase Storage Upload Fails
```typescript
// Check security rules in Firebase Console
// Rules must allow write to /cattle-reports/*
```

### Map Not Displaying
```typescript
// Check Leaflet CSS in network tab
// Should load from CDN
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
```

---

## 📚 Additional Resources

- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js)
- [Google Generative AI Documentation](https://ai.google.dev/tutorials)
- [browser-image-compression Docs](https://github.com/Donaldcwl/browser-image-compression)
- [Leaflet API Reference](https://leafletjs.com/reference.html)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Last Updated:** 2024
**Version:** 1.0.0
