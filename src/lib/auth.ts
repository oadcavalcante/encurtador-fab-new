import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                cpf: { label: "CPF", type: "text", placeholder: "Digite seu CPF" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.cpf || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { cpf: credentials.cpf },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    return null;
                }

                return { id: user.id, name: user.name, cpf: user.cpf };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.cpf = user.cpf;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.cpf = token.cpf as string;
            }
            return session;
        },
    },
};