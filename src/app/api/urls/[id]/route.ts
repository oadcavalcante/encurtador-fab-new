import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const urlId = params.id;

        const url = await prisma.uRL.findFirst({
            where: {
                id: urlId,
                userId: session.user.id,
            },
        });

        if (!url) {
            return NextResponse.json(
                { error: "URL não encontrada ou não pertence ao usuário" },
                { status: 404 }
            );
        }

        await prisma.uRL.delete({
            where: {
                id: urlId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir URL:", error);
        return NextResponse.json(
            { error: "Erro ao excluir URL" },
            { status: 500 }
        );
    }
}