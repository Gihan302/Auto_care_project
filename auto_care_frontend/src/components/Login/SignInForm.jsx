"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./AuthForm.css";

import apiClient from '@/utils/axiosConfig';

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
      
      const response = await apiClient.post("/api/auth/signin", {
        username: email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        
        console.log('✅ Login successful:', data);
        
        const token = data.accessToken || data.token;
        
        if (!token) {
          console.error('❌ No token in response:', data);
          setError("Authentication failed - no token received");
          setLoading(false);
          return;
        }

        // Store token in localStorage
        localStorage.setItem("token", token);

        // Fetch current user details
        const currentUserResponse = await apiClient.get("/user/currentuser");
        const currentUserData = currentUserResponse.data;

        // Store current user data in localStorage
        localStorage.setItem("user", JSON.stringify(currentUserData));
        
        console.log('💾 Token stored:', token.substring(0, 20) + '...');
        console.log('👤 User roles:', currentUserData.roles);

        // Check for admin role and redirect
        const userRoles = currentUserData.roles.map(role => role.name || role);
        if (userRoles.includes("ROLE_ADMIN")) {
          console.log('🎯 Admin detected, redirecting to admin dashboard');
          router.push('/admin/dashboard');
        } else if (userRoles.includes("ROLE_ICOMPANY")) {
          console.log('🎯 Insurance company detected, redirecting to insurance dashboard');
          router.push('/Insurance/dashboard');
        } else {
          console.log('🎯 Regular user, redirecting to dashboard');
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.response?.data?.message || "An error occurred during sign in. Please try again.");
      }
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