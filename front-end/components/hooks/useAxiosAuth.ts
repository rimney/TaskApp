'use client';

import { useEffect } from "react";
import { axiosAuth } from "@/lib/axios";
import { getSupabaseFrontendClient } from "@/lib/client";

export default function useAxiosAuth() {
  const supabase = getSupabaseFrontendClient();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      async (config) => {
        try {
          const { data: session } = await supabase.auth.getSession();
          const accessToken = session?.session?.access_token;

          if (accessToken && !config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
          return config;
        } catch (error) {
          console.error('Error fetching Supabase session:', error);
          return config; // Proceed with request even if token fetch fails
        }
      },
      (error) => {
        console.error('Axios request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on component unmount
    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
    };
  }, [supabase]);

  return axiosAuth;
}