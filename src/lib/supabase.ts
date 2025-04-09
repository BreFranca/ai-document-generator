import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: "supabase.auth.token",
    flowType: "pkce",
  },
});

// Enhanced auth state change listener with error handling
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "TOKEN_REFRESHED") {
    console.log("Token has been refreshed successfully");
  } else if (event === "SIGNED_OUT") {
    console.log("User signed out - clearing session");
    await supabase.auth.signOut(); // Ensure complete sign out
    window.localStorage.removeItem("supabase.auth.token");
  } else if (event === "USER_UPDATED") {
    console.log("User session updated");
  }
});

// Initialize session check
(async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Error checking session:", error.message);
      // Force sign out if session is invalid
      await supabase.auth.signOut();
    } else if (!session) {
      console.log("No active session found");
    }
  } catch (err) {
    console.error("Failed to check session:", err);
  }
})();
