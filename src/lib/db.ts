import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebase';
import { CattleReport } from '@/types';

// Convert blob to data URL (for storing images directly in Firestore)
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadCattleReport(
  report: Omit<CattleReport, 'id'>,
  imageBlob: Blob
): Promise<string> {
  try {
    const timestamp = Date.now();
    let imageUrl = '';

    // SIMPLE APPROACH: Store compressed image directly as data URL in Firestore
    // This avoids Firebase Storage CORS issues entirely
    try {
      imageUrl = await blobToDataUrl(imageBlob);
      
      // Limit data URL size to reasonable amount (max ~1MB for Firestore)
      // If larger, just store empty string
      if (imageUrl.length > 1000000) {
        console.warn('Image too large to store in Firestore, storing empty URL');
        imageUrl = '';
      }
    } catch (dataUrlError) {
      console.warn('Failed to convert image to data URL:', dataUrlError);
      imageUrl = '';
    }

    // Add report to Firestore
    const reportData = {
      ...report,
      imageUrl, // Store data URL or empty string
      timestamp,
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

export async function getCattleReportsNearby(
  latitude: number,
  longitude: number,
  radiusInKm: number = 5
): Promise<CattleReport[]> {
  try {
    const q = query(collection(db, 'cattle-reports'));
    const querySnapshot = await getDocs(q);

    const reports: CattleReport[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Simple distance calculation (in production, use geohashing)
      const distance = calculateDistance(
        latitude,
        longitude,
        data.latitude,
        data.longitude
      );

      if (distance <= radiusInKm) {
        reports.push({
          id: doc.id,
          ...data,
        } as CattleReport);
      }
    });

    return reports.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching cattle reports:', error);
    return [];
  }
}

export async function getCattleReport(reportId: string): Promise<CattleReport | null> {
  try {
    const docRef = doc(db, 'cattle-reports', reportId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        imageLoaded: true, // Mark as fully loaded with image
      } as CattleReport;
    }
    return null;
  } catch (error) {
    console.error('Error fetching cattle report:', error);
    return null;
  }
}

// Get report without image initially (lazy loading)
export async function getCattleReportLazy(reportId: string): Promise<Omit<CattleReport, 'imageUrl'> & { imageUrl?: string } | null> {
  try {
    const docRef = doc(db, 'cattle-reports', reportId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        latitude: data.latitude,
        longitude: data.longitude,
        cowCount: data.cowCount,
        roadCondition: data.roadCondition,
        description: data.description,
        timestamp: data.timestamp,
        uploadedBy: data.uploadedBy,
        upvotes: data.upvotes || 0,
        downvotes: data.downvotes || 0,
        imageLoaded: false, // Mark as not having image loaded yet
      } as any;
    }
    return null;
  } catch (error) {
    console.error('Error fetching cattle report (lazy):', error);
    return null;
  }
}

export async function upvoteCattleReport(reportId: string): Promise<void> {
  try {
    const docRef = doc(db, 'cattle-reports', reportId);
    await updateDoc(docRef, {
      upvotes: increment(1),
    });
  } catch (error) {
    console.error('Error upvoting report:', error);
    throw error;
  }
}

export async function downvoteCattleReport(reportId: string): Promise<void> {
  try {
    const docRef = doc(db, 'cattle-reports', reportId);
    
    // Update downvotes
    await updateDoc(docRef, {
      downvotes: increment(1),
    });

    // Check if downvotes reached 100+ and auto-delete
    const updatedDoc = await getDoc(docRef);
    if (updatedDoc.exists()) {
      const downvotes = updatedDoc.data().downvotes || 0;
      if (downvotes >= 10) {
        console.log(`Report ${reportId} reached 100+ downvotes, auto-deleting...`);
        await deleteReport(reportId);
      }
    }
  } catch (error) {
    console.error('Error downvoting report:', error);
    throw error;
  }
}

export async function deleteReport(reportId: string): Promise<void> {
  try {
    const docRef = doc(db, 'cattle-reports', reportId);
    await deleteDoc(docRef);
    console.log(`Report ${reportId} successfully deleted.`);
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

export async function getAllCattleReports(): Promise<CattleReport[]> {
  try {
    const q = query(collection(db, 'cattle-reports'));
    const querySnapshot = await getDocs(q);

    const reports: CattleReport[] = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
      } as CattleReport);
    });

    return reports.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error fetching all reports:', error);
    return [];
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
