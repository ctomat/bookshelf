import { type Prisma, type Book } from "@prisma/client";
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
  const book = await prisma.book.findUnique({
    where: { id: params.id },
  });

  if (!book) {
    return NextResponse.json({ error: "Book id not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(book);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: paramsType },
) {
  const body = (await req.json()) as Book;
  const book = await prisma.book.update({
    data: body,
    where: { id: params.id },
  });

  if (!book) {
    return NextResponse.json({ error: "Book id not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: "Book was updated" }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: paramsType },
) {
  const book = await prisma.book
    .delete({
      where: { id: params.id },
    })
    .catch((e: Prisma.PrismaClientKnownRequestError) => {
      error = e;
    });

  if (!book) {
    return NextResponse.json({ error: "Book id not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: "Book was deleted" }, { status: 200 });
}
