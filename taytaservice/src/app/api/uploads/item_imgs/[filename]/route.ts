// app/api/uploads/item_imgs/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const token = req.cookies.get('auth-token')?.value;

  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/item_imgs/${params.filename}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return new NextResponse('Error al obtener imagen', { status: response.status });
  }

  const imageBuffer = await response.arrayBuffer();

  return new NextResponse(imageBuffer, {
    status: 200,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
    },
  });
}
