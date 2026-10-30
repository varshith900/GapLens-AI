import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User
} from "firebase/auth";
import type { UserProfile } from "../types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } catch (err) {
    console.warn("Failed to initialize Firebase app:", err);
  }
}

// Local storage key for persistent user session
const LOCAL_USER_KEY = "digital_dark_spot_user";

export function getStoredUser(): UserProfile | null {
  const data = localStorage.getItem(LOCAL_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_USER_KEY);
  }
}

export async function loginUser(email: string, pass: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: cred.user.displayName || email.split("@")[0],
      };
      setStoredUser(profile);
      return profile;
    } catch (err: any) {
      console.error("Firebase Login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        throw new Error("Invalid email or password. If you don't have an account, click 'Create Researcher Account' below.");
      }
      if (err.code === "auth/invalid-email") {
        throw new Error("Please enter a valid email address.");
      }
      throw new Error(err.message || "Failed to sign in. Please verify your credentials.");
    }
  }

  // Graceful local demonstration authentication fallback
  const demoProfile: UserProfile = {
    uid: `demo_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
    email,
    displayName: email.split("@")[0],
  };
  setStoredUser(demoProfile);
  return demoProfile;
}

export async function signupUser(email: string, pass: string, name?: string): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || email,
        displayName: name || email.split("@")[0],
      };
      setStoredUser(profile);
      return profile;
    } catch (err: any) {
      console.error("Firebase Signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered. Please sign in instead.");
      }
      if (err.code === "auth/weak-password") {
        throw new Error("Password must be at least 6 characters.");
      }
      if (err.code === "auth/invalid-email") {
        throw new Error("Please provide a valid email address.");
      }
      throw new Error(err.message || "Failed to create account.");
    }
  }

  const demoProfile: UserProfile = {
    uid: `user_${Date.now()}`,
    email,
    displayName: name || email.split("@")[0],
  };
  setStoredUser(demoProfile);
  return demoProfile;
}

export async function signInWithGoogle(): Promise<UserProfile> {
  if (isFirebaseConfigured && auth) {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      provider.setCustomParameters({
        prompt: "select_account"
      });
      const cred = await signInWithPopup(auth, provider);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || "researcher@gmail.com",
        displayName: cred.user.displayName || (cred.user.email ? cred.user.email.split("@")[0] : "Google Researcher"),
      };
      setStoredUser(profile);
      return profile;
    } catch (err: any) {
      console.error("Firebase Google Sign-In error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in canceled: popup was closed before completion.");
      }
      if (err.code === "auth/popup-blocked") {
        throw new Error("Popup blocked: please allow browser popups for localhost to complete Google Sign In.");
      }
      if (err.code === "auth/unauthorized-domain") {
        const customErr = new Error("This domain (localhost) is not authorized in Firebase Authentication settings.");
        (customErr as any).code = "auth/unauthorized-domain";
        throw customErr;
      }
      if (err.code === "auth/operation-not-allowed") {
        throw new Error("Google Sign-In is not enabled for this Firebase project. Enable it under Firebase Console > Authentication > Sign-in method.");
      }
      throw new Error(err.message || "Google sign-in encountered an issue.");
    }
  }

  // Graceful Google OAuth demonstration profile for local preview
  const googleProfile: UserProfile = {
    uid: `google_${Date.now()}`,
    email: "senior.researcher@gmail.com",
    displayName: "Dr. Elena Vance (Google Account)",
  };
  setStoredUser(googleProfile);
  return googleProfile;
}

export async function resetPassword(email: string): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
    return;
  }
  return new Promise((resolve) => setTimeout(resolve, 600));
}

export async function logoutUser(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
  setStoredUser(null);
}

export function subscribeAuth(callback: (user: UserProfile | null) => void) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        const p: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || "",
          displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Researcher"),
        };
        setStoredUser(p);
        callback(p);
      } else {
        const stored = getStoredUser();
        callback(stored);
      }
    });
  }

  const current = getStoredUser();
  callback(current);
  return () => {};
}
