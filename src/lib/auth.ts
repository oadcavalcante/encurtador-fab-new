import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
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

                // ** Se o usuário tem senha no banco, autentica pelo banco
                if (user && user.password && (await compare(credentials.password, user.password))) {
                    return {
                        id: user.id,
                        fullname: user.fullname,
                        name: user.name,
                        email: user.email,
                        cpf: user.cpf,
                        saram: user.saram,
                        postoGrad: user.postoGrad,
                        om: user.om,
                    };
                }

                // **2. Se não houver senha no banco, autentica via LDAP**
                const ldapClient = new Client({ url: LDAP_SERVER });

                try {
                    const userDN = `uid=${credentials.cpf},${LDAP_BASE_DN}`;
                    await ldapClient.bind(userDN, credentials.password);

                    const { searchEntries } = await ldapClient.search(LDAP_BASE_DN, {
                        scope: "sub",
                        filter: `(uid=${credentials.cpf})`,
                        attributes: ["cn", "FABguerra", "mail", "uid", "FABnrordem", "FABpostograd", "FABom",]
                    });

                    if (searchEntries.length === 0) {
                        throw new Error("user_not_found");
                    }

                    const ldapUser = searchEntries[0];

                    const newUser = await prisma.user.upsert({
                        where: { cpf: credentials.cpf },
                        update: {},
                        create: {
                            fullname: ldapUser.cn as string,
                            name: ldapUser.FABguerra as string,
                            email: (ldapUser.mail as string) || "",
                            cpf: credentials.cpf,
                            postoGrad: (ldapUser.FABpostograd as string) || "",
                            saram: (ldapUser.FABnrordem as string) || "",
                            om: (ldapUser.FABom as string) || "",
                        },
                    });

                    return {
                        id: newUser.id,
                        fullname: newUser.fullname,
                        name: newUser.name,
                        email: newUser.email,
                        cpf: newUser.cpf,
                        saram: newUser.saram,
                        postoGrad: newUser.postoGrad,
                        om: newUser.om,
                    };
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
                session.user.id = token.id;
                session.user.fullname = token.fullname;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.cpf = token.cpf;
                session.user.saram = token.saram;
                session.user.postoGrad = token.postoGrad;
                session.user.om = token.om;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.fullname = user.fullname;
                token.name = user.name;
                token.email = user.email;
                token.cpf = user.cpf;
                token.saram = user.saram;
                token.postoGrad = user.postoGrad;
                token.om = user.om;
            }
            return token;
        },
    },
};
