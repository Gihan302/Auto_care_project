"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LeasingRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/leasing/dashboard');
  }, [router]);

  return null;
}
