//npx tsx seeds/seed.ts

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hash("123456", 10);

    const user = await prisma.user.create({
        data: {
            name: "3S Cavalcante",
            email: "cavalcanteacon@fab.mil.br",
            password: hashedPassword,
        },
    });

    console.log("Usuário criado:", user);
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
