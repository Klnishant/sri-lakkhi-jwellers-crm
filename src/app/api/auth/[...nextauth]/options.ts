import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbconnect from "@/src/lib/dbconnect";
import UserModel from "@/src/models/User";
import { email } from "zod";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
           
            async authorize(credentials: any): Promise<any> {
                await dbconnect();

                try {
                    const user = await UserModel.findOne({ email: credentials.identifier });
                    if (!user) {
                        throw new Error("No user found with the provided email.");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password.toString());
                    if (!isPasswordValid) {
                        throw new Error("Invalid password.");
                    }
                    if(isPasswordValid){
                        return user;
                    }
                } catch (error:any) {
                    throw new error(error);
                }
            }
        }),
    ],

    callbacks: {
        async jwt({ token, user}){
            if(user){
                token._id = (user as any)._id;
                token.name = user.name;
                token.email = user.email;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }){
            if(token && session.user){
                (session.user as any)._id = token._id;
                session.user.name = token.name;
                session.user.email = token.email;
                (session.user as any).role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: '/sign-in'
    }
}