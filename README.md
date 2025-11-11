# Cowtion - Road Safety Alert System

A modern web application that helps drivers and road users stay cautious of cattle on roads. Real-time alerts powered by AI analysis and community reports.

## 🚀 Features

- **Real-time Map View**: See your current location and cattle alerts on an interactive map
- **Intelligent Density Markers**: Color-coded alerts (red for high density, amber for moderate, orange for low)
- **AI-Powered Analysis**: Automatically detects cattle count and road conditions using Google's Gemini AI
- **Image Compression**: Optimized image uploads with automatic compression before storage
- **Community Voting**: Upvote/downvote reports to help others identify reliable alerts
- **Geotagged Reports**: All alerts include precise location coordinates
- **Real-time Updates**: Reports refresh every 30 seconds for the latest information
- **Firebase Integration**: Secure cloud storage for images and data
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS 4
- **Maps**: Leaflet + React-Leaflet
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI**: Google Generative AI (Gemini)
- **Image Compression**: browser-image-compression
- **State Management**: Zustand
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account (free tier available)
- Google Generative AI API key

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
cd cowtion
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database (Start in test mode for development)
4. Enable Storage
5. Go to Project Settings and copy your Firebase config

### 3. Google Generative AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini API
3. Copy the API key

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase and Gemini API keys:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY=your_gemini_key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 How to Use

### Viewing Alerts

1. The map shows your current location (blue circle)
2. Cattle alerts are displayed as colored circles:
   - 🔴 **Red**: High cattle density (high danger)
   - 🟠 **Orange**: Moderate cattle density
   - 🟡 **Amber**: Low cattle density
3. Larger circles indicate more reports in that area
4. Click on any alert to see detailed information

### Reporting a Cattle Alert

1. Click the **+** button in the bottom-right corner
2. Take or upload a photo of the cattle on the road
3. Wait for AI analysis (shows cattle count and road condition)
4. Click "Upload Alert" to submit
5. Your report appears on the map immediately

### Voting on Reports

1. Click on any cattle alert marker on the map
2. A modal opens with report details including:
   - Photo of the cattle
   - Number of cattle detected
   - Road condition assessment
   - Upload timestamp
3. Use the **Helpful** or **Not Helpful** buttons to vote
4. Your vote helps improve alert credibility

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Leaflet CSS
│   ├── page.tsx            # Main home page
│   └── globals.css         # Global styles
├── components/
│   ├── Map.tsx             # Interactive Leaflet map
│   ├── UploadModal.tsx      # Image upload and AI analysis modal
│   └── ReportDetailsModal.tsx # Report details and voting modal
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   ├── db.ts               # Firestore operations
│   ├── aiAnalysis.ts       # Gemini AI integration
│   └── imageCompression.ts # Image compression utilities
├── store/
│   └── cowStore.ts         # Zustand state management
├── types/
│   └── index.ts            # TypeScript type definitions
└── hooks/
    └── (custom hooks)
```

## 🔒 Security & Deployment

### Firebase Security Rules

Set up Firestore security rules (in Firebase Console):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cattle-reports/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
      allow delete: if false;
    }
  }
}
```

Set up Storage security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cattle-reports/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### Deploy to Vercel

```bash
npm run build
vercel
```

Follow the prompts to connect your GitHub repository and deploy.

## 🌐 API Integration Details

### Firebase Firestore Schema

**Collection: `cattle-reports`**
```typescript
{
  id: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  cowCount: number;
  roadCondition: string;
  description: string;
  timestamp: number;
  uploadedBy: string;
  upvotes: number;
  downvotes: number;
}
```

### Gemini AI Prompt

The app sends images to Gemini API with this prompt:
- Count visible cattle
- Assess road condition (Good/Moderate/Poor)
- Provide hazard description

Example response:
```json
{
  "cowCount": 5,
  "roadCondition": "Moderate",
  "description": "5 cows on right side of road, heavy traffic nearby"
}
```

## 🐛 Troubleshooting

### Map Not Loading
- Check if Leaflet CSS is loaded in browser DevTools
- Ensure location permissions are granted
- Try with fallback location (San Francisco by default)

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase security rules are not too restrictive
- Ensure project is on Blaze plan for storage

### Gemini API Errors
- Verify API key is valid and enabled
- Check API quotas in Google Cloud Console
- App falls back to mock data if API is unavailable

### Image Upload Fails
- Check browser storage quota
- Ensure image is less than 50MB (gets compressed to ~500KB)
- Verify Firebase Storage rules allow writes

## 📊 Future Enhancements

- [ ] User authentication and profiles
- [ ] Reporting abuse/spam alerts
- [ ] Historical data and trends
- [ ] Multi-language support
- [ ] Push notifications for nearby alerts
- [ ] Heatmap visualization
- [ ] Weather integration
- [ ] Advanced filtering (time range, cattle count, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a comprehensive Next.js full-stack project demonstrating:
- Real-time geolocation services
- AI/ML integration
- Cloud database management
- Image processing and optimization
- Interactive mapping
- Responsive web design

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

**Stay Safe on the Roads! 🚗🐄**
