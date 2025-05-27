import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Import toast from sonner package
import { getSupabaseFrontendClient } from '../lib/client';
import React from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = getSupabaseFrontendClient();

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <Button className="cursor-pointer" onClick={logout}>
      Logout
    </Button>
  );
}