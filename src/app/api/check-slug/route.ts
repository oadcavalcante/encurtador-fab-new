import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug não fornecido" }, { status: 400 });
        }

        const exists = await prisma.uRL.findUnique({
            where: { short: slug }
        });

        return NextResponse.json({ exists: !!exists });
    } catch (error) {
        console.error("Erro no servidor:", error);
        return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
    }
}
