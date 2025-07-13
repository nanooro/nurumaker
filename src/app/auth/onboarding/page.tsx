"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login"); // Redirect to login if no user is found
      } else {
        setUser(user);
        // Pre-fill name if already exists in profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profileData) {
          setName(profileData.full_name || '');
        }
      }
    };
    getUser();
  }, [router]);

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user) {
      setError("No user found. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("Attempting to save name:", name); // Log the name being saved

    // Update the profiles table with only the name
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        full_name: name,
      })
      .eq('id', user.id);

    if (updateProfileError) {
      console.error("Error updating profile:", updateProfileError); // Log the error
      setError(updateProfileError.message);
      setLoading(false);
      return;
    }

    // Also update user_metadata and display_name for direct access
    const { error: updateUserError } = await supabase.auth.updateUser({
      data: { full_name: name },
      // Directly update display_name
      display_name: name,
    });

    if (updateUserError) {
      console.error("Error updating user metadata:", updateUserError); // Log the error
      setError(updateUserError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/editor"); // Redirect to editor after onboarding
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-md p-8 shadow-2xl rounded-2xl border border-border bg-card">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            Complete Your Profile
          </h1>
        </div>

        <form onSubmit={handleOnboarding} className="space-y-6">
          <FloatingInput
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving Profile..." : "Save Profile"}
          </Button>
        </form>
      </Card>
    </motion.main>
  );
}
