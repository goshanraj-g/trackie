"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center max-w-xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Track Your Job Application Effortlessly
        </h1>
        <p className="text-muted-foreground text-lg">
          A modern, minimal tracker to organize your job hunt, and stay
          focused... No spreadsheets, just clarity
        </p>
        <Link href="/login">
          <Button variant="primary" className="cursor-pointer" size="lg">
            Get Started
          </Button>
        </Link>
      </div>
    </main>
  );
}
