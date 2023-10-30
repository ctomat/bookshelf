import { type Prisma, type Book } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "~/db";

let error: Prisma.PrismaClientKnownRequestError;

export async function GET() {
  const books = await prisma.book.findMany({
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Book;

  await prisma.book
    .create({
      data: { ...body, published: new Date(body.published) },
    })
    .catch((e: Prisma.PrismaClientKnownRequestError) => {
      error = e;
    });

  if (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { success: "The book was created!" },
    { status: 202 },
  );
}
