import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

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
    // const categorias = await prisma.category.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: "desc" },
    // });

    return NextResponse.json("show");
  } catch (error) {
    console.error("[GET_CATEGORIES]", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar categorias" },
      { status: 500 }
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { name, color, userId } = body;

//     console.log(name, color, userId);

//     if (!name || !userId) {
//       return NextResponse.json(
//         { error: "Nome e userId são obrigatórios" },
//         { status: 400 }
//       );
//     }

//     const novaCategoria = await prisma.category.create({
//       data: {
//         name,
//         color,
//         userId,
//       },
//     });

//     return NextResponse.json(novaCategoria);
//   } catch (error) {
//     console.error("[CREATE_CATEGORY]", error);
//     return NextResponse.json(
//       { error: "Erro ao criar categoria" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const body = await request.json();
//     const { id, name, color } = body;

//     if (!id || !name) {
//       return NextResponse.json(
//         { error: "ID e nome são obrigatórios" },
//         { status: 400 }
//       );
//     }

//     const categoriaAtualizada = await prisma.category.update({
//       where: { id },
//       data: { name, color },
//     });

//     return NextResponse.json(categoriaAtualizada);
//   } catch (error) {
//     console.error("[UPDATE_CATEGORY]", error);
//     return NextResponse.json(
//       { error: "Erro ao atualizar categoria" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "ID da categoria é obrigatório" },
//         { status: 400 }
//       );
//     }

//     await prisma.category.delete({
//       where: { id },
//     });

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("[DELETE_CATEGORY]", error);
//     return NextResponse.json(
//       { error: "Erro ao excluir categoria" },
//       { status: 500 }
//     );
//   }
// }
