"use client";

import { getProviders, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DisclaimerFooter from "@/components/DisclaimerFooter";

export default function LoginPage() {
  // Define providers state with a proper type
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Use signIn with the 'credentials' provider
      const res = await signIn("credentials", {
        redirect: false, // Prevent automatic page reload
        email,
        password,
      });

      if (res?.error) {
        console.error("Login failed:", res.error);
        alert("Invalid email or password. Please try again.");
      } else {
        console.log("Login successful!");
        // Redirect or handle successful login
        window.location.href = "/"; // Redirect to home or another page
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Fetch providers on component mount (still useful for other providers like Google)
  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers); // Save providers to state
    };

    fetchProviders();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 mb-24">
      {/* Header Section */}
      <header className="absolute top-0 left-0 p-4">
        <img src="images/vb_logo.png" alt="VB Logo" className="w-20 h-20" />
      </header>

      {/* Entrance Image */}
      <section>
        <img
          src="images/vitalbite.png"
          alt="VitalBite Logo"
          className="mx-auto mb-2"
        />
      </section>

      {/* Title */}
      <h1 className="text-5xl font-playfair font-bold text-teal mb-6">
        VitalBite
      </h1>

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-sm p-3 border rounded-lg font-semibold font-playfair text-teal placeholder-teal mb-6"
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-sm p-3 border rounded-lg font-semibold text-teal placeholder-teal font-playfair mb-6"
      />

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="w-full max-w-sm p-3 bg-teal text-white rounded-lg font-semibold font-playfair mb-4"
      >
        Login
      </button>

      {/* Sign-in Buttons for Providers */}
      {providers &&
        Object.values(providers).map((provider: any) => {
          if (provider.id === "credentials") return null; // Do not show credentials button
          return (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="w-full max-w-sm p-3 bg-teal text-white rounded-lg font-playfair font-semibold mb-4"
            >
              Sign in with {provider.name}
            </button>
          );
        })}

      {/* Create Account Link */}
      <Link
        href="/signup"
        className="text-teal font-semibold font-playfair text-sm mt-4"
      >
        Create account
      </Link>

      {/* Footer */}
      <DisclaimerFooter />
    </div>
  );
}
