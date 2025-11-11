# Cowtion - Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the official Next.js hosting platform with automatic deployments.

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
vercel
```

Follow the prompts:
- Select project directory: `.`
- Confirm settings
- Add environment variables (see Step 4)
- Deploy

#### Step 4: Set Environment Variables

After initial deployment, add your environment variables:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_KEY
```

Or add via Vercel Dashboard:
1. Go to Project Settings
2. Click Environment Variables
3. Add each variable
4. Redeploy project

#### Step 5: Redeploy with Env Vars

```bash
vercel --prod
```

---

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Create .dockerignore

```
node_modules
.git
.gitignore
.env.local
.next
```

#### Build & Run

```bash
docker build -t cowtion .
docker run -p 3000:3000 -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key cowtion
```

---

### Option 3: Firebase Hosting

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Initialize Firebase

```bash
firebase init hosting
```

Select:
- Use existing project or create new
- Choose public directory: `.next`
- Configure rewrites: Yes
- Add automatic builds: Yes (if using GitHub)

#### Step 3: Build & Deploy

```bash
npm run build
firebase deploy
```

---

### Option 4: Self-Hosted (AWS EC2, DigitalOcean, etc.)

#### Step 1: Server Setup

```bash
# SSH into server
ssh ubuntu@your_server_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Step 2: Clone & Setup

```bash
git clone your_repo_url cowtion
cd cowtion
npm install
```

#### Step 3: Build

```bash
npm run build
```

#### Step 4: Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'cowtion',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        // ... other env vars
      },
    },
  ],
};
```

#### Step 5: Start Application

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### Step 6: Nginx Reverse Proxy

```bash
sudo apt install nginx -y
```

Create `/etc/nginx/sites-available/cowtion`:

```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/cowtion /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Production Security Checklist

### Firebase Security

- [ ] Change Firestore rules from test mode to production
- [ ] Enable authentication (Firebase Auth)
- [ ] Set up rate limiting
- [ ] Enable backup and recovery
- [ ] Set up monitoring and alerts

### API Keys

- [ ] Restrict Firebase API key to web apps only
- [ ] Set HTTP referrer restrictions in Google Cloud
- [ ] Limit Gemini API quota
- [ ] Enable API monitoring

### HTTPS & SSL

- [ ] Enable HTTPS/SSL certificate
- [ ] Redirect HTTP to HTTPS
- [ ] Set secure cookie flags
- [ ] Enable HSTS header

### Environment

- [ ] Use environment variables only (no hardcoded secrets)
- [ ] Enable Web Application Firewall (WAF)
- [ ] Set up DDoS protection
- [ ] Configure CORS properly
- [ ] Enable security headers

---

## 📊 Monitoring & Logging

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to layout.tsx:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Firebase Monitoring

1. Go to Firebase Console
2. Enable Crashlytics
3. Enable Performance Monitoring
4. Set up real-time alerts

### Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/nextjs
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          production: true
```

### Environment Variables in GitHub

1. Go to Repository Settings
2. Click Secrets and variables → Actions
3. Add secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

---

## 📈 Performance Optimization

### Enable Compression

Already configured in Next.js. Verify in Network tab:
- Images should be compressed
- JS bundles should be gzipped
- CSS should be minified

### Database Optimization

```typescript
// Add index on geolocation queries
// In Firestore Console:
// Collection: cattle-reports
// Fields: latitude (ASC), longitude (ASC)
```

### Caching Strategy

```typescript
// Cache reports for 30 seconds
const CACHE_DURATION = 30000;

let cachedReports = null;
let cacheTime = 0;

export async function getCachedReports() {
  const now = Date.now();
  if (cachedReports && now - cacheTime < CACHE_DURATION) {
    return cachedReports;
  }
  cachedReports = await getCattleReportsNearby(...);
  cacheTime = now;
  return cachedReports;
}
```

---

## 🐛 Troubleshooting Deployment

### Build Fails

```bash
# Clear build cache
rm -rf .next

# Rebuild
npm run build
```

### Environment Variables Not Loading

```bash
# Verify env vars are set
echo $NEXT_PUBLIC_FIREBASE_API_KEY

# Check .env.local exists in production
# Use platform-specific env var UI instead
```

### Database Connection Issues

```typescript
// Check Firebase config
console.log('Firebase Project:', db);

// Verify security rules
// Use Firebase Console to test read/write
```

### Image Upload Fails

- Check Firebase Storage quota
- Verify security rules allow uploads
- Check image size (should be < 50MB)

---

## 📞 Post-Deployment Checklist

- [ ] Test landing page loads
- [ ] Test map displays with location
- [ ] Test upload functionality
- [ ] Test image compression
- [ ] Test AI analysis
- [ ] Test voting
- [ ] Test in mobile browser
- [ ] Monitor for errors in console
- [ ] Check performance metrics
- [ ] Verify HTTPS is enabled
- [ ] Set up uptime monitoring
- [ ] Configure automated backups

---

## 🔗 Deployment Links

### Production URLs

After deployment, your app will be available at:

- **Vercel**: `https://cowtion.vercel.app` (automatically generated)
- **Custom Domain**: Setup in Vercel/Firebase/Server settings

### Useful Links

- [Vercel Deployment Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [Domain Registrar](https://domains.google.com or Namecheap)

---

## 📚 Additional Resources

- [Next.js Deployment Guide](https://nextjs.org/docs/deployment/static-exports)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com)

---

**Version:** 1.0.0
**Last Updated:** 2024
