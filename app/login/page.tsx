"use client";

import { supabase } from "../lib/supabaseClient";


export default function LoginPage() {
    const handleLogin = async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000",
        },
      });
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center">
        <button
          onClick={handleLogin}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    );
  }