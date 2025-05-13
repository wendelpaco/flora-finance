import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Parâmetro 'userId' é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const goals = await prisma.goal.findMany({
      where: { user: { id: userId } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("[GET_GOALS]", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar metas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { target, deadline, userId } = body;

    if (!target || !deadline || !userId) {
      return NextResponse.json(
        { error: "Meta, prazo e userId são obrigatórios" },
        { status: 400 }
      );
    }

    const newGoal = await prisma.goal.create({
      data: {
        name: body.name || "Meta",
        target,
        current: body.current || 0,
        deadline: new Date(deadline),
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(newGoal);
  } catch (error) {
    console.error("[CREATE_GOAL]", error);
    return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, target, deadline, current } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID da meta é obrigatório" },
        { status: 400 }
      );
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        name: body.name,
        target,
        current,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("[UPDATE_GOAL]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar meta" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "ID da meta é obrigatório" },
      { status: 400 }
    );
  }

  try {
    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_GOAL]", error);
    return NextResponse.json(
      { error: "Erro ao excluir meta" },
      { status: 500 }
    );
  }
}
