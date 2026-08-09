"use client";

/**
 * components/auth/AuthContext.tsx
 *
 * Supabase Auth & Profile Context Provider for Vayam.
 * Manages user session, database profile syncing, demo mode toggle, and auth state.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, fetchDbProfile, upsertDbProfile } from "@/lib/db/supabase";
import type { DbProfile } from "@/types/db";
import type { UserProfileDraft } from "@/lib/core/user-profile";
import { EMPTY_PROFILE, PROFILE_STORAGE_KEY } from "@/lib/core/user-profile";
import { normalizeStateCode } from "@/lib/core/profile/normalization";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  dbProfile: DbProfile | null;
  userProfile: UserProfileDraft;
  loading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
  updateProfile: (profileDraft: UserProfileDraft) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_PROFILE: DbProfile = {
  id: "demo-user-12345",
  full_name: "Suhani Sharma",
  date_of_birth: "2006-05-15",
  state_id: null,
  district: "Pune",
  city: "Pune",
  education_level: "secondary",
  employment_status: "student",
  occupation: "Student",
  annual_income_inr: 250000,
  is_student: true,
  gender: "female",
  preferred_language: "en",
  avatar_url: null,
  role: "citizen",
  onboarding_completed: true,
  profile_completion: 85,
  is_demo_user: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileDraft>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Helper to convert DbProfile to front-end UserProfileDraft
  const convertDbToUserProfile = (dbProf: DbProfile): UserProfileDraft => {
    const stateInfo = normalizeStateCode(dbProf.state_id);
    return {
      id: dbProf.id,
      name: dbProf.full_name || "",
      dateOfBirth: dbProf.date_of_birth || "",
      gender: (dbProf.gender as any) || "prefer_not_to_say",
      location: {
        stateCode: stateInfo.stateCode,
        stateName: stateInfo.stateName,
        district: dbProf.district || "",
        residenceType: "urban",
      },
      educationLevel: (dbProf.education_level as any) || "",
      employmentStatus: (dbProf.employment_status as any) || "",
      annualIncomeInr: dbProf.annual_income_inr ?? undefined,
      isStudent: dbProf.is_student,
      preferredLanguage: dbProf.preferred_language || "en",
      createdAt: dbProf.created_at,
      updatedAt: dbProf.updated_at,
    };
  };

  // Sync profile data to LocalStorage for offline fallback
  const syncToLocalStorage = (draft: UserProfileDraft) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  };

  // Load initial session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initSession } } = await supabase.auth.getSession();
        if (initSession?.user && mounted) {
          setSession(initSession);
          setUser(initSession.user);
          setIsDemo(false);

          // Fetch profile from DB
          const prof = await fetchDbProfile(initSession.user.id);
          if (prof && mounted) {
            setDbProfile(prof);
            const mapped = convertDbToUserProfile(prof);
            setUserProfile(mapped);
            syncToLocalStorage(mapped);
          } else if (mounted) {
            // New user without profile row yet (handle_new_user trigger creates default)
            const fallbackProf: DbProfile = {
              id: initSession.user.id,
              full_name: initSession.user.user_metadata?.full_name || initSession.user.email?.split("@")[0] || "Citizen",
              date_of_birth: null,
              state_id: null,
              district: "",
              city: "",
              education_level: null,
              employment_status: null,
              occupation: "",
              annual_income_inr: null,
              is_student: false,
              gender: "prefer_not_to_say",
              preferred_language: "en",
              avatar_url: null,
              role: "citizen",
              onboarding_completed: false,
              profile_completion: 15,
              is_demo_user: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setDbProfile(fallbackProf);
            const mapped = convertDbToUserProfile(fallbackProf);
            setUserProfile(mapped);
            syncToLocalStorage(mapped);
          }
        } else if (mounted) {
          // Check if user saved demo state or local draft
          const rawLocal = localStorage.getItem(PROFILE_STORAGE_KEY);
          if (rawLocal) {
            try {
              const parsed = JSON.parse(rawLocal) as UserProfileDraft;
              if (parsed.name && parsed.name !== "Citizen") {
                setUserProfile(parsed);
              }
            } catch {
              // ignore
            }
          }
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (event === "SIGNED_IN" && currentSession?.user) {
        setIsDemo(false);
        const prof = await fetchDbProfile(currentSession.user.id);
        if (prof) {
          setDbProfile(prof);
          const mapped = convertDbToUserProfile(prof);
          setUserProfile(mapped);
          syncToLocalStorage(mapped);
        }
      } else if (event === "SIGNED_OUT") {
        setDbProfile(null);
        setUser(null);
        setSession(null);
        setIsDemo(false);
        setUserProfile(EMPTY_PROFILE);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsDemo(false);
        const prof = await fetchDbProfile(data.user.id);
        if (prof) {
          setDbProfile(prof);
          const mapped = convertDbToUserProfile(prof);
          setUserProfile(mapped);
          syncToLocalStorage(mapped);
        }
      }
      setLoading(false);
      setAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Failed to sign in" };
    }
  };

  const signUp = async (email: string, pass: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
          },
        },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        setIsDemo(false);

        // Save profile row in Supabase
        const newDbProf: Partial<DbProfile> & { id: string } = {
          id: data.user.id,
          full_name: fullName,
          preferred_language: "en",
          role: "citizen",
          onboarding_completed: false,
        };
        await upsertDbProfile(newDbProf);
        const fetched = await fetchDbProfile(data.user.id);
        if (fetched) {
          setDbProfile(fetched);
          const mapped = convertDbToUserProfile(fetched);
          setUserProfile(mapped);
          syncToLocalStorage(mapped);
        }
      }

      setLoading(false);
      setAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Failed to create account" };
    }
  };

  const signInDemo = () => {
    setIsDemo(true);
    setDbProfile(DEMO_USER_PROFILE);
    const mapped = convertDbToUserProfile(DEMO_USER_PROFILE);
    setUserProfile(mapped);
    syncToLocalStorage(mapped);
    setAuthModalOpen(false);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setSession(null);
      setDbProfile(null);
      setIsDemo(false);
      setUserProfile(EMPTY_PROFILE);
      if (typeof window !== "undefined") {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
      }
      setLoading(false);
    }
  };

  const updateProfile = async (profileDraft: UserProfileDraft) => {
    setUserProfile(profileDraft);
    syncToLocalStorage(profileDraft);

    if (user && !isDemo) {
      const dbPayload: Partial<DbProfile> & { id: string } = {
        id: user.id,
        full_name: profileDraft.name || null,
        date_of_birth: profileDraft.dateOfBirth || null,
        state_id: profileDraft.location?.stateCode || null,
        district: profileDraft.location?.district || null,
        education_level: profileDraft.educationLevel || null,
        employment_status: profileDraft.employmentStatus || null,
        annual_income_inr: profileDraft.annualIncomeInr ?? null,
        is_student: Boolean(profileDraft.isStudent),
        gender: profileDraft.gender || null,
        preferred_language: profileDraft.preferredLanguage || "en",
        updated_at: new Date().toISOString(),
      };

      const res = await upsertDbProfile(dbPayload);
      if (res.success && res.data) {
        setDbProfile(res.data);
      }
      return res;
    }

    return { success: true };
  };

  const isAuthenticated = Boolean(user || isDemo);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        dbProfile,
        userProfile,
        loading,
        isAuthenticated,
        isDemo,
        authModalOpen,
        setAuthModalOpen,
        signIn,
        signUp,
        signInDemo,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
