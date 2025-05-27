'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js'; // Import User type
import { getSupabaseFrontendClient } from '@/lib/client';
import useAxiosAuth from './useAxiosAuth';

export function useAuth() {
  const router = useRouter();
  const supabase = getSupabaseFrontendClient();
  const axiosAuth = useAxiosAuth();
  const [user, setUser] = useState<User | null>(null); // Use User type instead of any

  const getProtectedData = async () => {
    try {
      const response = await axiosAuth.get('/protected');
      console.log('Protected data:', response.data);
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log('Session:', data);

        if (!data.session) {
          router.push('/login');
        } else {
          setUser(data.session.user);
          await getProtectedData();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/login');
      }
    };
    checkSession();
  }, [router, supabase, axiosAuth, getProtectedData]); 

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { user, logout };
}