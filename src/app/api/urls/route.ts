import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const urls = await prisma.uRL.findMany({
            where: { userId: session.user.id },
        });

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
