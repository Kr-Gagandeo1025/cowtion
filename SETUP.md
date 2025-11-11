# Cowtion - Complete Setup & Installation Guide

## Project Overview

**Cowtion** is a Next.js-based web application designed to provide real-time cattle alerts on roads. It helps drivers stay cautious of livestock on the road through:
- AI-powered image analysis (Cattle detection & road condition assessment)
- Interactive map with real-time alerts
- Community voting system
- Image compression & cloud storage
- Geolocation services

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm or yarn** package manager
- **Firebase account** (free tier available at https://firebase.google.com)
- **Google Generative AI API key** (free at https://makersuite.google.com/app/apikey)

### Step 1: Navigate to Project

```bash
cd /home/kumar-gagandeo/Desktop/majorProject/cowtion
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16 with TypeScript
- React 18
- Firebase SDK
- Leaflet for mapping
- Zustand for state management
- Google Generative AI SDK
- Image compression library

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your Firebase and API keys:

```env
# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Generative AI (from Google AI Studio)
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key
```

### Step 4: Run Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## 📋 Firebase Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project** or **Create project**
3. Enter project name: "Cowtion"
4. Disable Google Analytics (optional)
5. Click **Create project**

### 2. Enable Firestore Database

1. In Firebase console, navigate to **Build** → **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode** (for development)
4. Choose region (closest to you)
5. Click **Enable**

### 3. Enable Storage

1. Go to **Build** → **Storage**
2. Click **Get Started**
3. Start in **Test Mode**
4. Choose region matching Firestore
5. Click **Done**

### 4. Get Configuration

1. Go to **Project Settings** (gear icon)
2. In **Your apps** section, select **Web** (or add web app)
3. Copy the Firebase config object
4. Fill in your `.env.local` file with these values

### 5. Set Security Rules

#### Firestore Rules

Go to **Firestore Database** → **Rules** tab and set:

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

#### Storage Rules

Go to **Storage** → **Rules** tab and set:

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

## 🔑 Google Generative AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the API key
4. Add to `.env.local`: `NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY=your_key`

## 📁 Project Structure

```
cowtion/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with Leaflet CSS
│   │   ├── page.tsx                # Landing page redirect
│   │   ├── landing.tsx             # Landing page component
│   │   ├── landing/page.tsx        # Landing route
│   │   ├── home/page.tsx           # Home/map page route
│   │   ├── home/page-home.tsx      # Home page component
│   │   └── globals.css             # Global Tailwind styles
│   │
│   ├── components/
│   │   ├── Map.tsx                 # Interactive Leaflet map
│   │   ├── UploadModal.tsx         # Image upload & AI analysis
│   │   └── ReportDetailsModal.tsx   # Report details & voting
│   │
│   ├── lib/
│   │   ├── firebase.ts             # Firebase initialization
│   │   ├── db.ts                   # Firestore CRUD operations
│   │   ├── aiAnalysis.ts           # Gemini AI integration
│   │   └── imageCompression.ts     # Image compression utilities
│   │
│   ├── store/
│   │   └── cowStore.ts             # Zustand state management
│   │
│   └── types/
│       └── index.ts                # TypeScript definitions
│
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript configuration
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── .env.local.example              # Example environment variables
└── README.md                       # Project documentation
```

## 🎯 Key Features Implementation

### 1. Real-time Location Tracking
- Uses browser's Geolocation API
- Updates every 10 seconds (configurable)
- Fallback to San Francisco if permission denied

### 2. Map with Dynamic Markers
- Leaflet + React-Leaflet integration
- Color-coded cattle density visualization
  - 🔴 Red: High density
  - 🟠 Orange: Moderate density
  - 🟡 Amber: Low density
- Clickable markers to view details

### 3. Image Upload & AI Analysis
- Client-side image compression (browser-image-compression)
- Geotagged image upload to Firebase Storage
- Gemini AI analysis for:
  - Cattle count detection
  - Road condition assessment
  - Hazard description

### 4. Community Voting
- Upvote/downvote reports
- Vote state persisted in Zustand store
- Helps identify reliable alerts

### 5. Data Persistence
- Firestore for report metadata
- Firebase Storage for images
- Automatic compression before upload
- Distance-based filtering (10km radius)

## 🚀 Building for Production

### Build Optimization

```bash
npm run build
```

This will:
- Compile TypeScript
- Optimize React components
- Generate static pages
- Create optimized bundle

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts to:
1. Login to Vercel
2. Connect GitHub repository
3. Import project
4. Add environment variables
5. Deploy

## 🐛 Common Issues & Solutions

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution:** Check that `.env.local` has correct Firebase credentials

### Issue: "Cannot find module 'leaflet'"
**Solution:** Ensure Leaflet CSS is loaded in layout.tsx head

### Issue: Map not displaying
**Solution:** 
- Check browser console for errors
- Verify location permissions are granted
- Ensure Leaflet CSS is included

### Issue: AI analysis returns mock data
**Solution:** 
- Verify Google Generative AI API key
- Check API quotas in Google Cloud Console
- Ensure API is enabled

### Issue: Image upload fails
**Solution:**
- Check Firebase Storage rules
- Verify storage bucket is accessible
- Ensure image size is under 50MB

## 📊 Database Schema

### Firestore Collection: `cattle-reports`

```typescript
{
  id: string;                    // Document ID
  latitude: number;              // GPS latitude
  longitude: number;             // GPS longitude
  imageUrl: string;              // Firebase Storage URL
  cowCount: number;              // Detected cattle count
  roadCondition: "Good" | "Moderate" | "Poor";
  description: string;           // AI-generated description
  timestamp: number;             // Unix timestamp (ms)
  uploadedBy: string;            // User identifier
  upvotes: number;               // Vote count
  downvotes: number;             // Vote count
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env.local`
2. **Firebase Rules**: Start with test mode, move to production rules
3. **Image Validation**: Only accept image MIME types
4. **Rate Limiting**: Consider adding backend rate limiting
5. **HTTPS**: Always use HTTPS in production
6. **API Keys**: Restrict API keys in Google Cloud Console

## 📈 Performance Tips

1. **Image Compression**: Automatically compresses to ~500KB
2. **Code Splitting**: Dynamic imports for map component
3. **Lazy Loading**: Components load only when needed
4. **Caching**: Reports refresh every 30 seconds
5. **CDN**: Firebase Storage provides global CDN

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Generative AI](https://ai.google.dev/)
- [Leaflet Documentation](https://leafletjs.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📞 Support & Troubleshooting

For issues:
1. Check browser console for errors (F12)
2. Verify environment variables
3. Check Firebase console for quota/errors
4. Review README.md for detailed instructions

## ✅ Deployment Checklist

- [ ] All environment variables configured
- [ ] Firebase database created and secured
- [ ] Storage bucket configured
- [ ] Gemini API enabled
- [ ] Build completes without errors
- [ ] Dev server runs locally
- [ ] All features tested
- [ ] Ready for production deployment

## 📄 License

MIT - Feel free to use for personal or commercial projects

---

**Happy coding! 🚗🐄**
