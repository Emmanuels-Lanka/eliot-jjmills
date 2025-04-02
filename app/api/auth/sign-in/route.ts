import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

import { db } from "@/lib/db";

const MAX_AGE = 60 * 60 * 24 * 30;         // 30 days

export async function POST(
    req: Request,
) {
    try {
        const { email, password } = await req.json();

        // Check if the email is already exist
        const existingUserByEmail = await db.user.findUnique({
            where: {
                email
            }
        });
       
        if (!existingUserByEmail) {
            return new NextResponse("Email does not exist!", { status: 409 });
        };

        // Check the password is correct
        const passwordMatch = await compare(password, existingUserByEmail.password);

        if (!passwordMatch) {
            return new NextResponse("Password does not match!", { status: 401 });
        }
        
        // Get the secret
        const secret = process.env.JWT_SECRET || "";

        // Sign the token
        const token = sign(
            { email, role: existingUserByEmail.role },
            secret,
            { expiresIn: MAX_AGE },
        );

        // Serialize the token to cookie
        const serialized = serialize("AUTH_TOKEN", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: MAX_AGE,
            path: "/",
        });

        return new NextResponse("Successfully authenticated!", { 
            status: 200,
            headers: { "Set-Cookie": serialized },
        });
        
    } catch (error) {
        console.error("[SIGNIN_ERROR]", error);
        return new NextResponse("Internal Login Error", { status: 500 });
    }
}