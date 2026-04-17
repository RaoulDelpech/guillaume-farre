import { NextResponse } from 'next/server';
import { mergePhotoData, savePhotoMetadata, type PhotoMetadata } from '@/lib/admin/photo-manager';
import { requireAdminAuth } from '@/lib/admin/auth';
import { PhotoMetadataArraySchema, MAX_POST_BODY_CHARS } from '@/lib/admin/photo-schema';

export async function GET() {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const photos = await mergePhotoData();
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth();
  if (authError) return authError;

  try {
    const text = await request.text();

    if (text.length > MAX_POST_BODY_CHARS) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const result = PhotoMetadataArraySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid photo data', details: result.error.issues },
        { status: 400 }
      );
    }

    await savePhotoMetadata(result.data as PhotoMetadata[]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving photos:', error);
    return NextResponse.json({ error: 'Failed to save photos' }, { status: 500 });
  }
}
