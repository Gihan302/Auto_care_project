"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import "./AuthForm.css";

export const SignUpForm = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [telephone, setTelephone] = useState("");
  const[nicNumber,setNICNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("Normal User");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const validateTelephone = (number) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(number);
  };

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const validatePassword = (password) => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (userType !== 'Normal User') {
      if (!telephone) {
        setError("Telephone is required");
        return;
      }
      if (!validateTelephone(telephone)) {
        setError("Please enter a valid 10-digit number.");
        return;
      }
      if (!nicNumber) {
        setError("NIC Number is required");
        return;
      }
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    const roleMap = {
      "Agent": "agent",
      "Leasing Company": "lcompany",
      "Insurance Company": "icompany",
      "Normal User": "user",
    };

    const role = roleMap[userType];

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname,
          lname,
          tnumber: telephone,
          nic: nicNumber,
          username: email,
          password,
          role: [role],
        }),
      });

      if (response.ok) {
        // Handle successful sign-up, e.g., redirect to another page
        console.log("Sign up successful");
        router.push('/signin');
      } else {
        // Handle sign-up error
        const data = await response.json();
        setError(data.message || "Sign up failed");
      }
    } catch (error) {
      setError("An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Create an Account</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="First Name"
            className="auth-input"
            value={fname}
            onChange={(e) => {
              setFname(e.target.value);
              setError(null);
            }}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="auth-input"
            value={lname}
            onChange={(e) => {
              setLname(e.target.value);
              setError(null);
            }}
          />
          <input
            type="tel"
            placeholder="Telephone Number"
            className="auth-input"
            value={telephone}
            onChange={(e) => {
              setTelephone(e.target.value);
              setError(null);
            }}
          />
          <input
            type="text"
            placeholder="NIC Number"
            className="auth-input"
            value={nicNumber}
            onChange={(e) => {
              setNICNumber(e.target.value);
              setError(null);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
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
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
          />

          <select
            className="auth-input"
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              setError(null);
              if (e.target.value === 'Normal User') {
                setTelephone('');
                setNICNumber('');
              }
            }}
          >
            <option value="Normal User">Normal User</option>
            <option value="Agent">Agent</option>
            <option value="Leasing Company">Leasing Company</option>
            <option value="Insurance Company">Insurance Company</option>
          </select>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-links text-center">
          <span>Already have an account? </span>
          <Link href="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
};