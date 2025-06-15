"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "../../components/ui/button";
import Menu from "./menu";
import { useEffect, useState } from "react";

export default function Header({ setTheme, theme }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="sticky top-0 left-0 w-screen h-12 z-50">
      <div className="flex items-center justify-start w-full h-full px-0 relative">
        <div className="w-full h-full flex justify-start items-center z-50 bg-white/60 dark:bg-black/60 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-start w-full px-2 relative">
            <Link href="/">
              <h1 className="text-5xl font-bold">Nannuru</h1>
            </Link>
            <div className="ml-auto flex items-center gap-2 mr-4">
              <Button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l1.414-1.414M6.05 6.05L4.636 4.636"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
                    />
                  </svg>
                )}
              </Button>
              <Menu />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
