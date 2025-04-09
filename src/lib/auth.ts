import { createContext, useContext } from "react";
import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      is_admin: data?.is_admin || false,
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
};
