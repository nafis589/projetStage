
import util from "util";
import db from "@/util/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const query = util.promisify(db.query).bind(db);

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.userId;
            }
            return session;
        }
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials){
                if (!credentials.email || !credentials.password) {
                    return null;
                }
                let user = await query(`SELECT * FROM users WHERE email = ?`, [credentials.email]);
                user = user[0];

                if (!user){
                    return null;
                }

                if (user.password){
                    return user.password === credentials.password ? user : null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    secret: 'hhhh',
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}
