import { NextResponse } from "next/server";

/**
 * GET  -> untuk iframe preview
 * POST -> untuk download via JS
 */

async function fetchCV(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profiles/me/cv/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Gagal mengambil CV dari backend");
  }

  return res;
}

// ==================
// PREVIEW (IFRAME)
// ==================
export async function GET() {
  const token = process.env.DEV_ACCESS_TOKEN;

  if (!token) {
    return new NextResponse("Token server tidak tersedia", { status: 401 });
  }

  try {
    const res = await fetchCV(token);
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (err) {
    return new NextResponse("Gagal preview CV", { status: 500 });
  }
}

// ==================
// DOWNLOAD (BUTTON)
// ==================
export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return new NextResponse("Token tidak ditemukan", { status: 401 });
    }

    const res = await fetchCV(token);
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="CV.pdf"',
      },
    });
  } catch (err) {
    return new NextResponse("Gagal download CV", { status: 500 });
  }
}