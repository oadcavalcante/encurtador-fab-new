import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Importa o Prisma

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "seu@email.com" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Credenciais inválidas!");
                }

                // Busca o usuário no banco
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !(await compare(credentials.password, user.password))) {
                    throw new Error("Credenciais inválidas!");
                }

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: any, user?: any }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
