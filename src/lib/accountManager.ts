import { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

const KNOWN_ACCOUNTS_KEY = "supabase_known_accounts";

interface KnownAccount {
  id: string;
  lastLogin: number;
}

export const getKnownAccounts = (): KnownAccount[] => {
  if (typeof window === "undefined") return [];
  const accounts = localStorage.getItem(KNOWN_ACCOUNTS_KEY);
  return accounts ? JSON.parse(accounts) : [];
};

export const addKnownAccount = (user: User) => {
  if (typeof window === "undefined") return;
  const accounts = getKnownAccounts();
  const newAccount: KnownAccount = {
    id: user.id,
    lastLogin: Date.now(),
  };

  // Remove if already exists to update lastLogin and prevent duplicates
  const filteredAccounts = accounts.filter((acc) => acc.id !== user.id);
  localStorage.setItem(
    KNOWN_ACCOUNTS_KEY,
    JSON.stringify([newAccount, ...filteredAccounts])
  );
};

export const removeKnownAccount = (userId: string) => {
  if (typeof window === "undefined") return;
  const accounts = getKnownAccounts();
  const filteredAccounts = accounts.filter((acc) => acc.id !== userId);
  localStorage.setItem(KNOWN_ACCOUNTS_KEY, JSON.stringify(filteredAccounts));
};

export const clearKnownAccounts = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KNOWN_ACCOUNTS_KEY);
};

export const updateProfilePicture = async (userId: string, imageUrl: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ avatar_url: imageUrl })
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile picture:', error);
    return { success: false, error };
  }
  return { success: true, data };
};
