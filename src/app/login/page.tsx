"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) setError(error.message);
    else router.push("/editor");
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-md p-8 rounded-2xl border bg-card shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          <ThemeToggle />
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
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <a href="/sign" className="text-primary underline">
            Sign up
          </a>
        </p>
      </Card>
    </motion.main>
  );
}

function FloatingInput({
  label,
  id,
  type,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={label}
        className={clsx(
          "peer w-full rounded-md border border-muted bg-transparent px-3 pt-5 pb-2 text-sm text-foreground placeholder-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        )}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-2 text-muted-foreground text-xs transition-all 
        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm 
        peer-placeholder-shown:text-muted-foreground peer-focus:top-2 
        peer-focus:text-xs peer-focus:text-foreground"
      >
        {label}
      </label>
    </div>
  );
}