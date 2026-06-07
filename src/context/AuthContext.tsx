/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  increment,
  serverTimestamp
} from "firebase/firestore";
import { auth, db, googleAuthProvider, handleFirestoreError, OperationType } from "../firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  city: string;
  state: string;
  language: string;
  photoURL: string;
  createdAt: any;
  updatedAt: any;
  lastLoginAt: any;
  issuesViewed: number;
  aiSummariesGenerated: number;
  pollsParticipated: number;
  reportsSubmitted: number;
  civicActionsCompleted: number;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isOnboarded: boolean;
  needsEmailVerification: boolean;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logInWithEmail: (email: string, pass: string) => Promise<void>;
  logInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (data: { name: string; city: string; state: string; language: string }) => Promise<void>;
  incrementEngagementMetric: (metric: "issuesViewed" | "aiSummariesGenerated" | "pollsParticipated" | "reportsSubmitted" | "civicActionsCompleted", amount?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  // High-fidelity Mock Profile for seamless direct preview
  const mockFirebaseUser = {
    uid: "mock-citizen-eleanor",
    email: "eleanor.vance@district7.gov",
    emailVerified: true,
    providerId: "firebase",
    displayName: "Eleanor Vance"
  } as any;

  const initialMockProfile: UserProfile = {
    uid: "mock-citizen-eleanor",
    name: "Eleanor Vance",
    email: "eleanor.vance@district7.gov",
    city: "San Jose",
    state: "CA",
    language: "English",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    issuesViewed: 14,
    aiSummariesGenerated: 8,
    pollsParticipated: 5,
    reportsSubmitted: 2,
    civicActionsCompleted: 4
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Enforce email verification (if using email/auth provider and not verified yet)
        if (currentUser.providerId === "firebase" && !currentUser.emailVerified) {
          setNeedsEmailVerification(true);
          setLoading(false);
          return;
        } else {
          setNeedsEmailVerification(false);
        }

        // Live synchronizer of profile stats
        const userDocRef = doc(db, "users", currentUser.uid);
        
        const unsubscribeProfile = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            setUserProfile(data);
            setIsOnboarded(true);
          } else {
            setUserProfile(null);
            setIsOnboarded(false);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        // No active Firebase Authentication session - Fallback to premium Mock Client mode for pristine preview
        setUser(mockFirebaseUser);
        setUserProfile(initialMockProfile);
        setIsOnboarded(true);
        setNeedsEmailVerification(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Actions
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      // Send verification link right away
      await sendEmailVerification(credential.user);
      
      // Seed initial metadata user draft profile
      const userDocRef = doc(db, "users", credential.user.uid);
      await setDoc(userDocRef, {
        uid: credential.user.uid,
        name: name,
        email: email,
        city: "",
        state: "",
        language: "English",
        photoURL: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        issuesViewed: 0,
        aiSummariesGenerated: 0,
        pollsParticipated: 0,
        reportsSubmitted: 0,
        civicActionsCompleted: 0
      });
      setNeedsEmailVerification(true);
    } catch (error: any) {
      console.error("SignUp Error:", error);
      throw error;
    }
  };

  const logInWithEmail = async (email: string, pass: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      if (!credential.user.emailVerified) {
        setNeedsEmailVerification(true);
      } else {
        setNeedsEmailVerification(false);
      }
    } catch (error: any) {
      console.error("Login Email Error:", error);
      throw error;
    }
  };

  const logInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const currentUser = result.user;
      
      // On Google login, check if document already exists; if not, initialize user draft to proceed to onboarding
      const userDocRef = doc(db, "users", currentUser.uid);
      const snapshot = await getDoc(userDocRef);
      if (!snapshot.exists()) {
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          name: currentUser.displayName || "Citizen Guide",
          email: currentUser.email || "",
          city: "",
          state: "",
          language: "English",
          photoURL: currentUser.photoURL || "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          issuesViewed: 0,
          aiSummariesGenerated: 0,
          pollsParticipated: 0,
          reportsSubmitted: 0,
          civicActionsCompleted: 0
        });
        setIsOnboarded(false);
      } else {
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        });
        setIsOnboarded(true);
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const sendVerification = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const signOut = async () => {
    if (auth.currentUser) {
      await firebaseSignOut(auth);
    } else {
      // Direct reset mockup metrics for preview sessions
      setUserProfile(initialMockProfile);
    }
  };

  const completeOnboarding = async (data: { name: string; city: string; state: string; language: string }) => {
    if (!user) throw new Error("No authenticated citizen");
    if (user.uid === "mock-citizen-eleanor") {
      setUserProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          name: data.name,
          city: data.city,
          state: data.state,
          language: data.language,
          updatedAt: new Date()
        };
      });
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        name: data.name,
        city: data.city,
        state: data.state,
        language: data.language,
        updatedAt: serverTimestamp()
      });
      setIsOnboarded(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const incrementEngagementMetric = async (metric: "issuesViewed" | "aiSummariesGenerated" | "pollsParticipated" | "reportsSubmitted" | "civicActionsCompleted", amount = 1) => {
    if (!user) return;
    if (user.uid === "mock-citizen-eleanor") {
      setUserProfile(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [metric]: (prev[metric] || 0) + amount,
          updatedAt: new Date()
        };
      });
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        [metric]: increment(amount),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isOnboarded,
        needsEmailVerification,
        signUpWithEmail,
        logInWithEmail,
        logInWithGoogle,
        resetPassword,
        sendVerification,
        signOut,
        completeOnboarding,
        incrementEngagementMetric
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be called inside AuthProvider");
  return context;
};
