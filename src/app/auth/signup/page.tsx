"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { motion } from "framer-motion";
import { addKnownAccount } from "@/lib/accountManager";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace("/editor"); // Redirect to editor if already signed in
      }
    };
    checkUserSession();
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      addKnownAccount(data.user); // Add user to known accounts
      setSuccess("✅ Check your email to confirm your account.");
    }
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
            Sign up
          </h1>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <FloatingInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FloatingInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-4">
          Already have an account?{" "}
          <a href="/auth/login" className="text-primary underline">
            Sign in
          </a>
        </p>
      </Card>
    </motion.main>
  );
}