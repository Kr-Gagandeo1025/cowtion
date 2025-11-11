# Firebase Storage CORS & Security Rules Fix

## Problem
You're getting a CORS error when trying to upload to Firebase Storage:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' blocked by CORS policy
```

This happens because:
1. Firebase Storage security rules are blocking unauthenticated uploads
2. CORS headers are not properly configured

## Solution

### Step 1: Update Firebase Storage Security Rules

Go to your Firebase Console:
1. Visit https://console.firebase.google.com/
2. Select your project **cowtion-x**
3. Go to **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Replace the entire content with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access
    match /{allPaths=**} {
      allow read: if request.auth != null || true;
    }
    
    // Allow uploads to cattle-reports folder (public)
    match /cattle-reports/{fileName} {
      allow write: if request.auth != null || request.size < 10 * 1024 * 1024; // Allow up to 10MB
      allow read: if true; // Allow public read
    }
    
    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

6. Click **Publish** to apply the rules

### Step 2: Enable CORS for Firebase Storage

Since the app is running on `http://localhost:3000`, you need to allow it:

1. Install Firebase CLI (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Create a file called `cors.json` in your project root:
```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3000/*"],
    "method": ["GET", "HEAD", "DELETE", "PUT", "POST", "OPTIONS"],
    "responseHeader": ["Content-Type", "x-goog-acl"],
    "maxAgeSeconds": 3600
  },
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600
  }
]
```

4. Apply CORS configuration:
```bash
gsutil cors set cors.json gs://cowtion-x.firebasestorage.app
```

### Step 3: For Production Deployment

Once you deploy to a production URL (e.g., `https://cowtion.vercel.app`), update the CORS rules to include that domain:

```json
[
  {
    "origin": ["http://localhost:3000", "https://cowtion.vercel.app"],
    "method": ["GET", "HEAD", "DELETE", "PUT", "POST", "OPTIONS"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

## Alternative: Use Firestore-Only Approach (Simpler)

If you don't want to deal with Storage security rules, you can store images as base64 in Firestore:

Edit `src/lib/db.ts` and modify the upload function to not use Firebase Storage at all:

```typescript
export async function uploadCattleReport(
  report: Omit<CattleReport, 'id'>,
  imageBlob: Blob,
  imageData?: string
): Promise<string> {
  try {
    const reportData = {
      ...report,
      imageUrl: imageData || '', // Store base64 image data directly
      timestamp: Date.now(),
      upvotes: 0,
      downvotes: 0,
    };

    const docRef = await addDoc(collection(db, 'cattle-reports'), reportData);
    return docRef.id;
  } catch (error) {
    console.error('Error uploading cattle report:', error);
    throw error;
  }
}
```

Then update `src/components/UploadModal.tsx` to pass image data:

```typescript
// Convert image to base64 before upload
const reader = new FileReader();
const imageBase64 = await new Promise<string>((resolve) => {
  reader.onload = () => resolve(reader.result as string);
  reader.readAsDataURL(compressedFile);
});

const reportId = await uploadCattleReport(
  { /* report data */ },
  compressedFile,
  imageBase64 // Pass base64 data
);
```

## Testing

After making these changes:

1. Rebuild your app:
```bash
npm run build
```

2. Run in development:
```bash
npm run dev
```

3. Try uploading an image from the home page

You should see the upload progress complete without CORS errors!

## Debugging

If you still get CORS errors:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for requests to `firebasestorage.googleapis.com`
4. Check the response headers for `Access-Control-Allow-Origin`
5. Verify your security rules are properly saved

Common issues:
- Rules not published (click Publish button)
- CORS not applied to the storage bucket
- Wrong bucket name in the rules
- Browser cache (try incognito mode)
