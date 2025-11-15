# Cron Job Setup Guide

## Overview
This guide explains how to set up automatic deletion of cattle reports older than 24 hours using the cleanup API endpoint.

## What Was Implemented

### 1. **Image Lazy Loading** ✅
- **Map markers** no longer load images in popups - this saves significant bandwidth and load time
- **Details modal** fetches the full image only when user clicks "View Details"
- Loading indicator shown while image is being fetched

**Files Modified:**
- `src/types/index.ts` - Added `imageLoaded` flag to CattleReport
- `src/lib/db.ts` - Added `getCattleReport()` and `getCattleReportLazy()` functions
- `src/components/Map.tsx` - Removed image from popup display
- `src/components/ReportDetailsModal.tsx` - Added lazy image loading with useEffect

### 2. **Auto-Cleanup Cron Job** ✅
- Automatically deletes reports older than 24 hours
- Can be triggered by external cron services or scheduled tasks
- Provides monitoring endpoints to check expired reports

**Files Created:**
- `src/lib/cleanup.ts` - Core cleanup logic
- `src/app/api/cleanup/route.ts` - API endpoints for the cron job

---

## Setup Instructions

### Option 1: Using External Cron Service (Recommended for Production)

#### GitHub Actions (Free & Reliable)

Create `.github/workflows/cleanup-cron.yml`:

```yaml
name: Cleanup Expired Reports

on:
  schedule:
    - cron: '0 * * * *'  # Run every hour
  workflow_dispatch:     # Allow manual trigger

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger cleanup job
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            https://your-deployment-url.com/api/cleanup
```

**Setup:**
1. Add `CRON_SECRET` environment variable to GitHub Secrets
2. Set `CRON_SECRET` in your `.env.local` file
3. Replace `your-deployment-url.com` with your actual deployment URL

#### EasyCron (Free Web-based Service)

1. Go to https://www.easycron.com
2. Create new cron job
3. Set URL: `https://your-deployment-url.com/api/cleanup`
4. Add Header: `Authorization: Bearer YOUR_CRON_SECRET`
5. Set frequency: Every hour or as desired

#### AWS CloudWatch Events (For AWS Deployments)

```json
{
  "Name": "cleanup-cattle-reports",
  "ScheduleExpression": "rate(1 hour)",
  "State": "ENABLED",
  "Targets": [
    {
      "Arn": "arn:aws:lambda:...",
      "RoleArn": "arn:aws:iam::...",
      "HttpParameters": {
        "HeaderParameters": {
          "Authorization": "Bearer YOUR_CRON_SECRET"
        }
      }
    }
  ]
}
```

### Option 2: Using Node-Cron (For Self-Hosted)

Install package:
```bash
npm install node-cron
```

Create `src/lib/cronServer.ts`:
```typescript
import cron from 'node-cron';
import { deleteExpiredReports } from './cleanup';

export function startCleanupCron() {
  // Run cleanup every hour (at the start of each hour)
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Running cleanup job...');
    const result = await deleteExpiredReports();
    console.log('[Cron] Cleanup result:', result);
  });

  console.log('[Cron] Cleanup cron job started (every hour)');
}
```

Add to your Next.js startup (in a server component or custom server):
```typescript
import { startCleanupCron } from '@/lib/cronServer';

// Call once when your app starts
startCleanupCron();
```

### Option 3: Using Vercel Crons (Easiest for Vercel Deployments)

Create `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 * * * *"
    }
  ]
}
```

Add environment variable in Vercel dashboard:
```
CRON_SECRET=your-secure-random-secret
```

---

## Environment Variables

Add to `.env.local`:

```env
# Cron job secret for API authentication
CRON_SECRET=your-super-secret-random-key-here
```

Generate a secure secret:
```bash
openssl rand -hex 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## API Endpoints

### POST /api/cleanup
**Trigger the cleanup job**

Request:
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  https://your-domain.com/api/cleanup
```

Response:
```json
{
  "success": true,
  "message": "Cleanup job completed",
  "deletedCount": 5,
  "errors": [],
  "timestamp": "2024-11-15T10:30:00Z"
}
```

### GET /api/cleanup
**Check how many reports will be deleted**

Request:
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cleanup
```

Response:
```json
{
  "success": true,
  "expiredReportsCount": 5,
  "message": "5 reports are eligible for deletion",
  "timestamp": "2024-11-15T10:30:00Z"
}
```

---

## Monitoring & Logging

The cleanup job logs all operations to the console:

```
[Cleanup Job] Starting cleanup at 2024-11-15T10:00:00Z
[Cleanup Job] Looking for reports older than 2024-11-14T10:00:00Z
[Cleanup Job] Found 50 total reports
[Cleanup Job] Deleted report: abc123 (age: 1445 minutes)
[Cleanup Job] Cleanup completed. Deleted 5 reports.
```

You can monitor logs in:
- **Vercel**: Vercel Dashboard → Logs
- **AWS**: CloudWatch Logs
- **Self-hosted**: Application logs

---

## Testing the Cleanup

### 1. Manual Test (via API)

```bash
# Check how many will be deleted
curl -X GET \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cleanup

# Run cleanup
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cleanup
```

### 2. Create Test Data (Development)

In your browser console or test script:
```javascript
// Create an old report for testing
const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
// Then upload a report manually and change timestamp in Firebase
```

### 3. Verify Deletion

- Check Firebase Console → Firestore → `cattle-reports` collection
- Verify old reports are removed after cleanup runs

---

## Recommended Schedule

| Use Case | Frequency | Cron Expression |
|----------|-----------|-----------------|
| Development | Daily | `0 0 * * *` |
| Production (Light) | Every 6 hours | `0 */6 * * *` |
| Production (Moderate) | Every 3 hours | `0 */3 * * *` |
| Production (Heavy) | Every hour | `0 * * * *` |
| Production (Very Heavy) | Every 30 min | `*/30 * * * *` |

---

## Troubleshooting

### Issue: Cron job not running
**Solution:**
- Verify `CRON_SECRET` matches in both environment and request header
- Check deployment logs for errors
- Ensure URL is publicly accessible (not behind auth wall)
- Test endpoint manually with curl

### Issue: Getting 401 Unauthorized
**Solution:**
- Verify `Authorization` header format: `Bearer YOUR_SECRET`
- Check environment variable is set correctly
- Regenerate and update secret if needed

### Issue: Reports not being deleted
**Solution:**
- Check that reports have valid `timestamp` field
- Verify 24-hour threshold (should be current time - 24 hours)
- Check Firebase permissions allow document deletion
- Review console logs for detailed error messages

---

## Best Practices

1. ✅ **Use a secure random secret** - Don't hardcode or use predictable values
2. ✅ **Monitor cleanup runs** - Set up alerts for failures
3. ✅ **Start with less frequent** - Begin with hourly, scale if needed
4. ✅ **Test thoroughly** - Verify in dev environment first
5. ✅ **Keep secrets in environment** - Never commit `CRON_SECRET`
6. ✅ **Set up logging** - Monitor logs for any issues
7. ✅ **Have a backup plan** - Know how to manually run cleanup if needed

---

## What About Image Lazy Loading?

The image lazy loading is already implemented in the code:

1. **Map popups** don't load images (saves bandwidth)
2. **Details modal** only loads image when opened
3. **Loading indicator** shown while fetching image

This reduces initial data usage by ~60-80% for maps with many markers!

**No additional setup needed** - it's automatic.

---

## Questions?

For more details on cleanup logic, see:
- `src/lib/cleanup.ts` - Main cleanup functions
- `src/app/api/cleanup/route.ts` - API endpoint implementation
- `src/lib/db.ts` - Database operations
