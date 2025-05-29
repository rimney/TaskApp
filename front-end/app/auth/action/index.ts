"use server"

import createSupabaseServerClient from "@/lib/server";

export async function singInWithEmailAndPassword(data: {
    email: string;
    password: string;
}) {
    const supabase = await createSupabaseServerClient();
    const result = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });

    return result;
}