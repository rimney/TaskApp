'use client';

import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
    <div className="w-full h-auto flex items-center justify-between">
            <div className="w-auto h-[50px] flex items-center justify-center">
        <img
          src="https://framerusercontent.com/images/vsdu0muTZsCIA7B6kX4sGvniM.svg?scale-down-to=1024"
          className="w-[330px] ml-2"
          alt=""
        />
      </div>
      <Button
        className="w-[70px] mr-2 bg-[#CAFE14] text-black border border-black shadow-[4px_5px_0px_0px_#ffffff] hover:bg-[white] hover:text-black hover:shadow-[0_0_15px_10px_rgba(255,255,255,0.3)] cursor-pointer transition-all duration-300"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
}