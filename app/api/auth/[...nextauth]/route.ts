import db from "@/util/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User as NextAuthUser, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

interface UserLocale {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    password: string;
}

async function queryUserByEmail(email: string): Promise<UserLocale | null> {
    const users = (await db.query(`SELECT * FROM users WHERE email = ?`, [email]) as unknown) as UserLocale[];
    return users[0] ?? null;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
            if (user) {
                token.role = user.role;
                token.userId = user.id;
            }
            console.log(token);
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.id = token.userId as string;
            }
            return session;
        }
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await queryUserByEmail(credentials.email);
                if (!user) {
                    return null;
                }
                // This is insecure. Use a library like bcrypt to hash passwords.
                const isValid = user.password === credentials.password;
                if (isValid) {
                    return user;
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST } 