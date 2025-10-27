"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./AuthForm.css";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login with:', email);
      
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log('✅ Login successful:', data);
        
        // FIXED: The token field is 'accessToken' not 'token'
        const token = data.accessToken || data.token;
        
        if (!token) {
          console.error('❌ No token in response:', data);
          setError("Authentication failed - no token received");
          setLoading(false);
          return;
        }

        // Store token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data));
        
        console.log('💾 Token stored:', token.substring(0, 20) + '...');
        console.log('👤 User roles:', data.roles);

        // Check for admin role and redirect
        if (data.roles && data.roles.includes("ROLE_ADMIN")) {
          console.log('🎯 Admin detected, redirecting to admin dashboard');
          router.push('/admin/dashboard');
        } else {
          console.log('🏠 Regular user, redirecting to homepage');
          router.push('/');
        }
      } else {
        const data = await response.json();
        console.error('❌ Login failed:', data);
        setError(data.message || "Sign in failed - invalid credentials");
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setError("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-links">
          <Link href="/forgot-password">Forgot Password?</Link>
          <Link href="/signup">Don't have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;