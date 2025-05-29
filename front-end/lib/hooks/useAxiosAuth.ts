'use client';

import { useEffect } from "react";
import { axiosAuth } from "../axios";
import { getSupabaseFrontendClient } from "../client";

const useAxiosAuth = () => {
    const supabase = getSupabaseFrontendClient();

    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use(async (config) => {
            const { data: session } = await supabase.auth.getSession();
            const accessToken = session?.session?.access_token;
            
            if (!config.headers['Authorization']) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
        );
        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept);
        }
    }, [])

    return axiosAuth;
}

export default useAxiosAuth;