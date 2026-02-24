"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginToPortal(formData: FormData) {
    const password = formData.get("password") as string;
    const envPassword = process.env.PORTAL_PASSWORD;

    if (!envPassword) {
        return { error: "Portal password is not configured on the server." };
    }

    if (password === envPassword) {
        (await cookies()).set("portal_auth", password, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });

        // Redirect user to the portal dashboard
        return { success: true };
    }

    return { error: "Invalid password." };
}

export async function logoutFromPortal() {
    (await cookies()).delete("portal_auth");
    redirect("/");
}
