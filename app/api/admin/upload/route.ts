import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { STORAGE_BUCKET, uploadObject, getObjectUrl } from '@/lib/storage';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Use JPG, PNG, WEBP, AVIF or GIF.' }, { status: 415 });
  }

  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: 'File too large (max 15MB)' }, { status: 413 });
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `media/${Date.now()}-${cleanName}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  let publicUrl = '';

  try {
    // Attempt cloud storage first
    await uploadObject(key, bytes, file.type);
    try {
      publicUrl = await getObjectUrl(key, 86400 * 7); // 7 days valid signed URL or direct
    } catch {
      publicUrl = `/api/admin/objects/url?key=${encodeURIComponent(key)}`;
    }
  } catch (storageErr) {
    console.warn('Cloud storage upload failed or not configured, falling back to local public/uploads:', storageErr);
    // Local storage fallback for seamless development & offline environments
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const localFilename = `${Date.now()}-${cleanName}`;
      const filePath = path.join(uploadsDir, localFilename);
      fs.writeFileSync(filePath, bytes);
      publicUrl = `/uploads/${localFilename}`;
    } catch (fsErr) {
      console.error('Failed to write file locally:', fsErr);
      return NextResponse.json({ error: 'Storage write failed' }, { status: 500 });
    }
  }

  try {
    const media = await db.media.create({
      data: {
        key,
        url: publicUrl,
        filename: file.name,
        mimeType: file.type,
        altText: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
      },
    });

    return NextResponse.json({
      success: true,
      media,
      key,
      url: publicUrl,
      bucket: STORAGE_BUCKET,
    });
  } catch (dbErr) {
    console.error('Database record create failed for media:', dbErr);
    // Even if db record fails, return the valid publicUrl so product image can still be saved!
    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
    });
  }
}
