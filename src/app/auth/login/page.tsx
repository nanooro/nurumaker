"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FloatingInput } from "@/components/ui/floating-input";
import { addKnownAccount } from "@/lib/accountManager";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
    } else if (data.user) {
      addKnownAccount(data.user); // Add user to known accounts
      router.push("/editor");
    }
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-md p-8 rounded-2xl border bg-card shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
            Sign in
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <FloatingInput
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in 👋"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-primary underline">
            Sign up
          </a>
        </p>
      </Card>
    </motion.main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}