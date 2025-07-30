"use client";
import React, { useState } from "react";
import Link from "next/link";
import "./AuthForm.css";

export const SignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [telephone, setTelephone] = useState("");
  const[nicNumber,setNICNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [telephoneError, setTelephoneError] = useState("");


  const validateTelephone = (number) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(number);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validateTelephone(telephone)) {
      setTelephoneError("Please enter a valid 10-digit number.");
      return;
    } else {
      setTelephoneError("");
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // TODO: Remove this log in production
    // console.log("Sign Up:", { fullName, idNumber, telephone, email, password, userType });
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Create an Account</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            className="auth-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {telephoneError && <p className="auth-error">{telephoneError}</p>}
          <input
          type="tel"
          placeholder="Telephone Number"
          className="auth-input"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
          />
          

          <input
            type="text"
            placeholder="NIC Number"
            className="auth-input"
            value={nicNumber}
            onChange={(e) => setNICNumber(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="auth-radio-group">
            <label><input type="radio" name="userType" value="Agent" onChange={(e) => setUserType(e.target.value)} required /> Agent</label>
            <label><input type="radio" name="userType" value="Leasing Company" onChange={(e) => setUserType(e.target.value)} /> Leasing Company</label>
            <label><input type="radio" name="userType" value="Insurance Company" onChange={(e) => setUserType(e.target.value)} /> Insurance Company</label>
            <label><input type="radio" name="userType" value="Normal User" onChange={(e) => setUserType(e.target.value)} /> Normal User</label>
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <div className="auth-links text-center">
          <span>Already have an account? </span>
          <Link href="/signin">Sign In</Link>
        </div>
      </div>
    </div>
  );
};