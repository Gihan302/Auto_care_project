// app/signin/page.jsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import './login.module.css'; // imports Tailwind layers + custom utility classes

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <main className="signin-grid">
      {/* LEFT: background photo */}
      <div className="signin-photo">
        <Image
          src="/hero2.jpg"   // <-- place your image in /public
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* RIGHT: sign-in card */}
      <div className="signin-form-area">
        <div className="signin-card">
          <div className="text-center">
            <h1>Welcome Back</h1>
            <p>Please enter your details.</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                Remember for 30 days
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary">
              Sign In
            </button>
          </form>

          <div className="divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <button className="btn-google">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {/* Google icon paths */}
            </svg>
            Sign in with Google
          </button>

          <p className="footer-text">
            Don’t have an account? <a href="#">Sign up now</a>
          </p>
        </div>
      </div>
    </main>
  );
}