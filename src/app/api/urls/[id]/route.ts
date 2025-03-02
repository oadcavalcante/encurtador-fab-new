import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Params = {
    id: string;
};

type RouteContext = {
    params: Promise<Params>;
};

export async function DELETE(req: NextRequest, { params }: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;

        const url = await prisma.uRL.findFirst({
            where: {
                id: id,
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
                id: id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir URL:", error);
        return NextResponse.json({ error: "Erro ao excluir URL" }, { status: 500 });
    }
}