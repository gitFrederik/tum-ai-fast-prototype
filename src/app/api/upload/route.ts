import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSignature } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const folder = body.folder ?? "pawnder/pets";
  const transformation = "f_auto,q_auto,w_800,h_800,c_fill,g_auto";

  const result = generateSignature({ folder, transformation });
  return NextResponse.json(result);
}
