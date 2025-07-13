"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, ChevronDown } from "lucide-react"; // Import User and ChevronDown icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { getKnownAccounts, removeKnownAccount } from "@/lib/accountManager";
import { useRouter } from "next/navigation";

export function EditorHeader() {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempUserName, setTempUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [knownAccounts, setKnownAccounts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndAccounts = async () => {
      setLoading(true); // Start loading
      const { data: { session } } = await supabase.auth.getSession(); // Get session first
      if (session) {
        const { data: { user } } = await supabase.auth.getUser(); // Then get user
        if (user) {
          setUser(user);
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .single();

          if (user) {
          setUser(user);
          console.log("Fetched user:", user); // Log the user object
          // Prioritize user.display_name
          if (user.display_name) {
            setUserName(user.display_name);
            setTempUserName(user.display_name);
          } else if (user.user_metadata?.full_name) {
            // Fallback to user_metadata.full_name
            setUserName(user.user_metadata.full_name);
            setTempUserName(user.user_metadata.full_name);
          } else {
            // Fallback to profiles table if not in user_metadata
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', user.id)
              .single();

            if (profileData) {
              console.log("Fetched profile data:", profileData); // Log profile data
              setUserName(profileData.full_name);
              setTempUserName(profileData.full_name || "");
            }
          }

          if (user.user_metadata?.avatar_url) {
            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(user.user_metadata.avatar_url);
            setUserAvatarUrl(publicUrlData.publicUrl);
          } else {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('avatar_url')
              .eq('id', user.id)
              .single();
            if (profileData?.avatar_url) {
              const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(profileData.avatar_url);
              setUserAvatarUrl(publicUrlData.publicUrl);
            }
          }
        }
        }
      } else {
        // No session, ensure user and name are reset
        setUser(null);
        setUserName(null);
        setTempUserName("");
        setUserAvatarUrl(null);
      }
      setKnownAccounts(getKnownAccounts());
      setLoading(false); // End loading
    };
    fetchUserAndAccounts();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          fetchUserAndAccounts(); // Re-fetch on auth state change
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe(); // Clean up listener
    };
  }, []); // Empty dependency array for initial load and listener setup

  useEffect(() => {
    if (!loading && user && (!userName || userName.trim() === '') && !isEditingName) {
      toast.info("Please set your username!", {
        action: {
          label: "Set Now",
          onClick: () => setIsEditingName(true),
        },
        duration: Infinity, // Make it sticky
        id: "set-username-toast", // Add an ID to prevent duplicates
      });
    }
  }, [loading, user, userName, isEditingName]);

  const handleSaveName = async () => {
    if (!user || !tempUserName.trim()) return;

    setLoading(true);
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({ full_name: tempUserName.trim() })
      .eq('id', user.id);

    if (updateProfileError) {
      toast.error("Failed to update username: " + updateProfileError.message);
      setLoading(false);
      return;
    }

    // Also update user_metadata and display_name
    const { error: updateUserError } = await supabase.auth.updateUser({
      data: { full_name: tempUserName.trim() },
      display_name: tempUserName.trim(),
    });

    if (updateUserError) {
      toast.error("Failed to update user metadata: " + updateUserError.message);
      setLoading(false);
      return;
    }

    setUserName(tempUserName.trim());
    setIsEditingName(false);
    toast.success("Username updated successfully!");
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    removeKnownAccount(user.id);
    router.push("/auth/login");
  };

  const handleSwitchAccount = async (email: string) => {
    await supabase.auth.signOut();
    router.push(`/auth/login?email=${encodeURIComponent(email)}`);
  };

  const handleAddAccount = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="w-full flex items-center justify-between p-4 border-b bg-card">
      <h1 className="text-2xl font-bold">
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">Create.</span>
        <span className="text-gray-800 dark:text-gray-200">Nannuru</span>
      </h1>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-3 border rounded-lg bg-muted/20">
              <User className="h-5 w-5" />
              <span className="font-medium text-sm hidden sm:block">{userName || "Guest"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isEditingName ? (
              <div className="p-2 flex flex-col gap-2">
                <input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="w-full p-1 border rounded text-sm bg-background"
                  placeholder="Your Name"
                />
                <Button size="sm" onClick={handleSaveName} disabled={loading}>
                  {loading ? "Saving..." : "Save Name"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditingName(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                {knownAccounts.map((account) => (
                  <DropdownMenuItem key={account.id} onClick={() => handleSwitchAccount(account.email)}>
                    {account.email} {account.id === user?.id && "(Current)"}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Settings</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setIsEditingName(true)}>Set Name</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAddAccount}>Add Another Account</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </header>
  );
}
