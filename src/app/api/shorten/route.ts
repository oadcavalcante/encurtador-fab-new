import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateRandomSlug(length: number = 5): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    let slug = "";
    for (let i = 0; i < length; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}

async function generateUniqueSlug(): Promise<string> {
    let slug = generateRandomSlug();
    let exists = await prisma.uRL.findUnique({ where: { short: slug } });
    while (exists) {
        slug = generateRandomSlug();
        exists = await prisma.uRL.findUnique({ where: { short: slug } });
    }
    return slug;
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { original, slug } = await req.json();

        if (!original) {
            return NextResponse.json({ error: "URL original é obrigatória" }, { status: 400 });
        }

        let finalSlug = slug;
        if (finalSlug) {
            const existingSlug = await prisma.uRL.findUnique({ where: { short: finalSlug } });
            if (existingSlug) {
                return NextResponse.json({ error: "Slug já está em uso" }, { status: 409 });
            }
        } else {
            finalSlug = await generateUniqueSlug();
        }

        const newUrl = await prisma.uRL.create({
            data: {
                original,
                short: finalSlug,
                userId: session.user.id,
            },
        });

        return NextResponse.json({ short: newUrl.short });
    } catch (error) {
        console.error("Erro ao encurtar URL:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ error: "Slug é obrigatório" }, { status: 400 });
    }

    const exists = await prisma.uRL.findUnique({ where: { short: slug } });
    return NextResponse.json({ exists: !!exists });
}