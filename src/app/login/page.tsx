"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setError("Wrong email or password. Make sure your email is verified.");
      } else {
        setError(error.message);
      }
    } else {
      window.location.href = "https://maker.nannuru.com/editor";
    }
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="p-6 w-full max-w-md space-y-4 shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-center">🔐 Login</h2>
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center space-y-3"
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
          <h3 className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign" className="underline text-primary ml-1">
              Sign up
            </Link>
          </h3>
        </form>
      </Card>
    </motion.main>
  );
}
