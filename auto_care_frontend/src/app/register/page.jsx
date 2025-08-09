'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

export default function page() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    acceptTerms: false
  });

  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Privacy Services and Terms to continue.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Account Created!",
      description: "Welcome to Auto Care! Your account has been created successfully.",
    });
  };

  const handleGoogleSignUp = () => {
    toast({
      title: "Google Sign Up",
      description: "Google authentication would be integrated here.",
    });
  };

  const handleDealerSignUp = () => {
    toast({
      title: "Dealer Account",
      description: "Redirecting to dealer registration...",
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Create an Account as a User</h2>
        <p className="text-sm text-muted-foreground">Please enter your details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="h-12"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, acceptTerms: !!checked }))
            }
          />
          <Label htmlFor="terms" className="text-sm">
            I accept the{' '}
            <Link href="#" className="text-auto-care-blue hover:underline">Privacy Services</Link>
            {' '}and{' '}
            <Link href="#" className="text-auto-care-blue hover:underline">Terms</Link>
          </Label>
        </div>

        <Button type="submit" className="w-full h-12 bg-auto-care-blue hover:bg-auto-care-dark-blue">
          Sign Up
        </Button>
      </form>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          className="w-full h-12 border-auto-care-blue text-auto-care-blue hover:bg-auto-care-light-blue"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="#" className="text-auto-care-blue hover:underline font-medium">
              Sign in
            </Link>
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDealerSignUp}
          className="w-full h-12 border-auto-care-blue text-auto-care-blue hover:bg-auto-care-light-blue"
        >
          Sign Up as a Dealer
        </Button>
      </div>
    </div>
  );
}
