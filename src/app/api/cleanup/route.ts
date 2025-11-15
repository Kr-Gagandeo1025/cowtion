import { NextRequest, NextResponse } from 'next/server';
import { deleteExpiredReports, getExpiredReportsCount } from '@/lib/cleanup';

/**
 * API endpoint for cleaning up expired cattle reports
 * Can be called by:
 * 1. External cron service (e.g., GitHub Actions, AWS CloudWatch, etc.)
 * 2. Next.js cron job library (node-cron)
 * 3. Manual testing
 * 
 * Security: Validate request origin in production
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Validate request origin in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';
    
    // For production, you should verify the request is from your cron service
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[API] Unauthorized cleanup attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[API] Cleanup job initiated');

    // Run the cleanup
    const result = await deleteExpiredReports();

    console.log('[API] Cleanup job completed', result);

    return NextResponse.json(
      {
        success: true,
        message: 'Cleanup job completed',
        deletedCount: result.deletedCount,
        errors: result.errors,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error in cleanup endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check how many reports will be deleted
 * Useful for monitoring and debugging
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Validate request in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dev-secret';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const expiredCount = await getExpiredReportsCount();

    return NextResponse.json(
      {
        success: true,
        expiredReportsCount: expiredCount,
        message: `${expiredCount} reports are eligible for deletion`,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Error checking expired reports:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
