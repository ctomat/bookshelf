import { type Prisma, type Author } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "~/db";

let error: Prisma.PrismaClientKnownRequestError;

export async function GET() {
  const books = await prisma.author.findMany({
    include: { books: { select: { title: true } } },
  });
  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Author;

  await prisma.author
    .create({ data: body })
    .catch((e: Prisma.PrismaClientKnownRequestError) => {
      error = e;
    });

  if (error) {
    console.error(error.code);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    { success: "The author was created!" },
    { status: 202 },
  );
}
