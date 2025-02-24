import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

//password -> 123456
const users = [
    { id: "1", name: "cavalcanteacon", email: "cavalcanteacon@fab.mil.br", password: "$2b$10$2NbczA69mTRd5ATxSt0GoOZ6faIOPX0TJ1b3AfBcBBxcm2guTFbRK" }
];

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "seu@email.com" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                const user = users.find(u => u.email === credentials?.email);
                if (!user || !(await compare(credentials!.password, user.password))) {
                    throw new Error("Credenciais inválidas!");
                }
                return { id: user.id, name: user.name, email: user.email };
            }
        })
    ],
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
