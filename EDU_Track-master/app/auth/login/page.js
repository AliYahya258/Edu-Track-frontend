"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';  // Add this import
import axios from 'axios';
import { Label } from "./label";
import { Input } from "./inputs";
import { cn } from "@/utils/cn";
import { BottomGradient } from '@/components/ui/BottomGradient';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', { email, password });
      const { accessToken, expiration, roles, id, username } = response.data; // include id
      const absoluteExpiration = Date.now() + expiration;
      const userData = {
        accessToken,
        roles,
        id, // store id in userData
        username,
        expiration: absoluteExpiration,
      };
      sessionStorage.setItem('userData', JSON.stringify(userData));
      router.push('/auth/protected');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setError('Invalid credentials');
    }
  };

  return (
      <div
          className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
      >
        {/* Add an overlay to improve text readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        {/* Form container with glass effect */}
        <div className="relative z-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white/10 backdrop-blur-md dark:bg-black/20">
          <h2 className="font-bold text-3xl text-white mb-2">
            Welcome to EDU Track
          </h2>
          <p className="text-gray-200 mb-6">
            Login to EDU Track if you already have an account
          </p>

          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email" className="text-white">Email Address</Label>
              <Input
                  id="email"
                  placeholder="Email Address"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </LabelInputContainer>

            <LabelInputContainer className="mb-4">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </LabelInputContainer>

            <button
                className="bg-gradient-to-br relative group/btn from-blue-600 to-blue-800 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
                type="submit">
              Log in &rarr;
              <BottomGradient />
            </button>

            <div className="bg-gradient-to-r from-transparent via-white/20 to-transparent my-8 h-[1px] w-full" />

            {/* Signup redirect section */}
            <div className="text-center">
              <p className="text-gray-200 mb-4">Don't have an account?</p>
              <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-6 py-2 border border-white/30 rounded-md text-white hover:bg-white/10 transition-colors duration-300 group"
              >
                Create Account
                <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </form>

          {error && (
              <div className="mt-4">
                <p className="text-red-400 text-center bg-red-400/10 py-2 rounded-md">{error}</p>
              </div>
          )}
        </div>
      </div>
  );
}

const LabelInputContainer = ({ children, className }) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
);