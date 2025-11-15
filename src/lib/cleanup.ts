import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Delete cattle reports that are older than 24 hours
 * This function should be called by a cron job or scheduled task
 * @returns Object containing number of deleted reports and any errors
 */
export async function deleteExpiredReports(): Promise<{
  deletedCount: number;
  errors: string[];
}> {
  try {
    const result = {
      deletedCount: 0,
      errors: [] as string[],
    };

    // Calculate timestamp for 24 hours ago
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    console.log(`[Cleanup Job] Starting cleanup at ${new Date(now).toISOString()}`);
    console.log(`[Cleanup Job] Looking for reports older than ${new Date(twentyFourHoursAgo).toISOString()}`);

    // Query all reports
    const q = query(collection(db, 'cattle-reports'));
    const querySnapshot = await getDocs(q);

    console.log(`[Cleanup Job] Found ${querySnapshot.size} total reports`);

    let deletedInBatch = 0;

    // Check each report and delete if older than 24 hours
    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const reportTimestamp = data.timestamp || 0;

      // If report is older than 24 hours, delete it
      if (reportTimestamp < twentyFourHoursAgo) {
        try {
          await deleteDoc(doc(db, 'cattle-reports', docSnapshot.id));
          deletedInBatch++;
          result.deletedCount++;
          console.log(`[Cleanup Job] Deleted report: ${docSnapshot.id} (age: ${Math.round((now - reportTimestamp) / (60 * 1000))} minutes)`);
        } catch (error) {
          const errorMsg = `Failed to delete report ${docSnapshot.id}: ${error instanceof Error ? error.message : String(error)}`;
          console.error(`[Cleanup Job] ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }
    }

    console.log(`[Cleanup Job] Cleanup completed. Deleted ${deletedInBatch} reports.`);

    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[Cleanup Job] Fatal error during cleanup: ${errorMsg}`);
    return {
      deletedCount: 0,
      errors: [errorMsg],
    };
  }
}

/**
 * Get count of reports that will be deleted on next cleanup
 * Useful for monitoring and alerting
 */
export async function getExpiredReportsCount(): Promise<number> {
  try {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    const q = query(collection(db, 'cattle-reports'));
    const querySnapshot = await getDocs(q);

    let expiredCount = 0;
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const reportTimestamp = data.timestamp || 0;

      if (reportTimestamp < twentyFourHoursAgo) {
        expiredCount++;
      }
    });

    return expiredCount;
  } catch (error) {
    console.error('Error getting expired reports count:', error);
    return 0;
  }
}
