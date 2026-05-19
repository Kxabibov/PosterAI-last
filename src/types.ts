import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  credits: number;
  createdAt: Timestamp | Date;
  isAdmin: boolean;
}

export interface PromptTemplate {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
  description: string;
  promptText: string;
  isSolo?: boolean;
}

export interface UserPoster {
  id?: string;
  userId: string;
  createdAt: Timestamp | Date;
  tiles: string[];
  productName: string;
  promptName: string;
}

export type AppStep = 'auth' | 'dashboard' | 'admin';
export type FlowStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
