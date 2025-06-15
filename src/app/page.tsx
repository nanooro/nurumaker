// app/page.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-background px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="p-6 max-w-xl w-full text-center space-y-4 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
          Welcome to Your Article App ✨
        </h1>
        <p className="text-muted-foreground text-sm">
          Create, preview, and share your own articles with image and content
          support.
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg">
            📝 Go to Editor
          </Button>
        </Link>
        {/* <footer className="pt-6 text-xs text-muted-foreground">
          Built with 🧠 by you · Powered by Next.js + Tailwind
        </footer> */}
      </Card>
    </motion.main>
  );
}
