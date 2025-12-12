"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./AuthForm.css";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("A password reset link has been sent to your email.");
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-subtext">
          Don’t worry! We’ll help you recover your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />

          <button type="submit" className="auth-button">Send Link</button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-links text-center">
          <Link href="/signin">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
};