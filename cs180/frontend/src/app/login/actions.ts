"use server";

import{redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import{createClient} from "@/utils/supabase/server";

import type{ AuthState} from "@/app/sign_up/actions";

export async function login(prevState: AuthState, formData: FormData) : Promise<AuthState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
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