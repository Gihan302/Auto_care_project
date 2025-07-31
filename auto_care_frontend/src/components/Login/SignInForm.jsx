"use client";
import React, { useState } from "react";
import Link from "next/link";
//import Link from "next/link";
//import Link from "next/link";
import "./AuthForm.css";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    // TODO: Remove this log in production
    // console.log("Sign In:", { email, password });
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="auth-links">
          <Link href="/forgot-password">Forgot Password?</Link>
          <Link href="/signup">Don't have an account?</Link>
        </div>
      </div>
    </div>
  );
};
