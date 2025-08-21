"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// Google SVG logo
const GoogleLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-2"
  >
    <g clipPath="url(#clip0_17_40)">
      <path
        d="M19.805 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.48c-.24 1.28-1.02 2.36-2.18 3.08v2.56h3.52c2.06-1.9 3.24-4.7 3.24-7.45z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.97-.89 6.63-2.41l-3.52-2.56c-.98.66-2.23 1.05-3.11 1.05-2.39 0-4.42-1.62-5.14-3.8H1.23v2.38C2.97 17.98 6.22 20 10 20z"
        fill="#34A853"
      />
      <path
        d="M4.86 12.28c-.23-.68-.36-1.41-.36-2.28s.13-1.6.36-2.28V5.34H1.23C.45 6.77 0 8.34 0 10c0 1.66.45 3.23 1.23 4.66l3.63-2.38z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.47 0 2.78.51 3.81 1.51l2.85-2.85C14.97 1.01 12.7 0 10 0 6.22 0 2.97 2.02 1.23 5.34l3.63 2.38C5.58 5.58 7.61 3.96 10 3.96z"
        fill="#EA4335"
      />
    </g>
    <defs>
      <clipPath id="clip0_17_40">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Only Google sign-in

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-muted/10 p-8 rounded-xl border shadow space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-2">
          Trackie
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Continue with your Google account to track your job applications,
          manage your watchlist, and get personalized insights
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 py-2 rounded-md font-semibold shadow transition"
          disabled={loading}
        >
          <GoogleLogo />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
        {error && (
          <div className="mt-4 flex items-center justify-center">
            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-sm border border-red-200 text-sm font-medium">
              {error}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
