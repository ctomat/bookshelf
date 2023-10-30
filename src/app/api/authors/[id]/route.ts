import { type Prisma, type Author } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "~/db";

type paramsType = {
  id: string;
};

let error: Prisma.PrismaClientKnownRequestError;

export async function GET(
  req: NextRequest,
  { params }: { params: paramsType },
) {
  const author = await prisma.author.findUnique({
    where: { id: params.id },
    include: { books: { select: { title: true, published: true } } },
  });

  if (!author) {
    return NextResponse.json({ error: "Author id not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(author);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: paramsType },
) {
  const body = (await req.json()) as Author;
  const author = await prisma.author.update({
    data: body,
    where: { id: params.id },
  });

  if (!author) {
    return NextResponse.json({ error: "Author id not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: "Author was updated" }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: paramsType },
) {
  const author = await prisma.author
    .delete({
      where: { id: params.id },
    })
    .catch((e: Prisma.PrismaClientKnownRequestError) => {
      error = e;
    });

  if (!author) {
    return NextResponse.json({ error: "Author id not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: "Author was deleted" }, { status: 200 });
}
