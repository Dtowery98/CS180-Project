"use server";

import {redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {createClient} from "@/utils/supabase/server";

//what actionts sends back to page. describes what kind of return message or error to send to user
export type AuthState = {error? : string; message?: string};

export async function signup(prevState: AuthState, formData: FormData) : Promise<AuthState> {
const name = String(formData.get("name") ?? "").trim();
 const email = String(formData.get("email") ?? "").trim().toLowerCase();
const password = String(formData.get("password") ?? "");

//ensures all forms are filled out
if (!name || !email || !password){
    return {error: "Please fill all the fields out"};
    }
//ensures the email submitted is a ucr email
if (!email.endsWith("@ucr.edu")){

    return {error: "Please use a valid Ucr email address."}
}
const supabase = await createClient();

const{data,error} = await supabase.auth.signUp({

    email,password, options:{data:{name}},

});

if (error){

    return {error:error.message};
}

//email confirmation before session begins. supabase requirement for hosting

if(!data.session){
    return{message:"check your amail for confirmation link"};
}

revalidatePath("/", "layout");
redirect("/");
}