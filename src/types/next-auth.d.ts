import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        postograd?: string;
    }

    interface Session {
        user: User;
    }
}
