"use server";

import{redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import{createClient} from "@/utils/supabase/server";

import type{ AuthState} from "@/app/sign_up/actions";

export async function login(email1: string, password1: string) : Promise<AuthState> {
    const email = email1.trim().toLowerCase();
    const password = password1;
//error message if all fields are not filled
    if (!email || !password){
        return {error: "Please fill all fields"};

    }
    const supabase = await createClient();
    const {error} = await supabase.auth.signInWithPassword({
        email,password});
    //error message if email or pass is wrong
    if (error){
        return {error: "incorrect email or password"};


    }

    revalidatePath("/", "layout");
    redirect("/");
}