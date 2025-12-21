import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    const signature = req.headers.get("x-hub-signature-256");

    if (!secret || !signature) {
      return NextResponse.json(
        { message: "Missing secret or signature" },
        { status: 401 },
      );
    }

    const body = await req.text();

    const hmac = crypto.createHmac("sha256", secret);
    const digest = Buffer.from(
      "sha256=" + hmac.update(body).digest("hex"),
      "utf8",
    );
    const checksum = Buffer.from(signature, "utf8");

    if (
      checksum.length !== digest.length ||
      !crypto.timingSafeEqual(digest, checksum)
    ) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    revalidatePath("/");

    console.log("Revalidation triggered by GitHub Push");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { message: `Error revalidating: ${error}` },
      { status: 500 },
    );
  }
}
