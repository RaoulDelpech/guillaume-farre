import { NextResponse } from 'next/server';
import { mergePhotoData, savePhotoMetadata, type PhotoMetadata } from '@/lib/admin/photo-manager';

export async function GET() {
  try {
    const photos = await mergePhotoData();
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const photos: PhotoMetadata[] = await request.json();
    await savePhotoMetadata(photos);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving photos:', error);
    return NextResponse.json({ error: 'Failed to save photos' }, { status: 500 });
  }
}
