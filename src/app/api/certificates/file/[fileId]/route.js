import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const fileId = params.fileId;
    
    // Find certificate by file ID to verify it exists
    const certificate = await Certificate.findOne({ certificateFileId: fileId });
    
    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate file not found' },
        { status: 404 }
      );
    }

    // Read file
    const filePath = path.join(process.cwd(), 'uploads', 'certificates', certificate.certificateFileName);
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const extension = path.extname(certificate.certificateFileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (['.jpg', '.jpeg'].includes(extension)) contentType = 'image/jpeg';
    else if (extension === '.png') contentType = 'image/png';
    else if (extension === '.pdf') contentType = 'application/pdf';
    else if (extension === '.webp') contentType = 'image/webp';

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${certificate.certificateId}${extension}"`,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Get certificate file error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
