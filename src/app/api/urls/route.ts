import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const urls = await prisma.uRL.findMany();

        const formattedUrls = urls.map((url) => ({
            ...url,
            createdAt: url.createdAt ? url.createdAt.toISOString() : null,
        }));

        return NextResponse.json(formattedUrls);
    } catch (error) {
        console.error("Erro ao buscar URLs:", error);
        return NextResponse.json({ error: "Erro ao buscar URLs" }, { status: 500 });
    }
}
