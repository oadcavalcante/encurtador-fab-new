import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Client } from "ldapts";

const LDAP_SERVER = process.env.LDAP_SERVER as string;
const LDAP_BASE_DN = process.env.LDAP_BASE_DN as string;

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                cpf: { label: "CPF", type: "text", placeholder: "12345678900" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.cpf || !credentials?.password) {
                    throw new Error("missing_credentials");
                }

                // **1. Verifica se usuário existe no banco de dados local**
                const user = await prisma.user.findUnique({
                    where: { cpf: credentials.cpf },
                });

                if (user && (await compare(credentials.password, user.password))) {
                    return { id: user.id, name: user.name, cpf: user.cpf, email: user.email, postograd: user.postoGrad };
                }

                // **2. Tenta autenticar via LDAP**
                const ldapClient = new Client({ url: LDAP_SERVER });

                try {
                    const userDN = `uid=${credentials.cpf},${LDAP_BASE_DN}`;
                    await ldapClient.bind(userDN, credentials.password);

                    const { searchEntries } = await ldapClient.search(LDAP_BASE_DN, {
                        scope: "sub",
                        filter: `(uid=${credentials.cpf})`,
                        attributes: ["cn", "mail", "FABpostograd", "FABnrordem", "FABom", "FABguerra"]
                    });

                    if (searchEntries.length === 0) {
                        throw new Error("user_not_found");
                    }

                    const ldapUser = searchEntries[0];

                    const newUser = await prisma.user.upsert({
                        where: { cpf: credentials.cpf },
                        update: {},
                        create: {
                            cpf: credentials.cpf,
                            name: ldapUser.FABguerra as string,
                            fullname: ldapUser.cn as string,
                            email: (ldapUser.mail as string) || "",
                            postoGrad: (ldapUser.FABpostograd as string) || "",
                            saram: (ldapUser.FABnrordem as string) || "",
                            om: (ldapUser.FABom as string) || "",
                        },
                    });

                    return { id: newUser.id, name: newUser.name, cpf: newUser.cpf, email: newUser.email };
                } catch (error: any) {
                    if (error.message.includes("Invalid Credentials")) {
                        throw new Error("invalid_credentials");
                    } else if (error.message.includes("connect ECONNREFUSED") || error.message.includes("getaddrinfo ENOTFOUND")) {
                        throw new Error("ldap_unavailable");
                    } else {
                        console.error("Erro inesperado no LDAP:", error);
                        throw new Error("unknown_error");
                    }
                } finally {
                    await ldapClient.unbind().catch(() => console.error("Erro ao desconectar do LDAP."));
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
