export interface CattleReport {
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
  userVote?: 'up' | 'down' | null;
  imageLoaded?: boolean; // Track if image has been loaded
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface AIAnalysisResult {
  cowCount: number;
  roadCondition: string;
  description: string;
}

export interface CompressedImage {
  blob: Blob;
  size: number;
  originalSize: number;
  compressionRatio: number;
}
