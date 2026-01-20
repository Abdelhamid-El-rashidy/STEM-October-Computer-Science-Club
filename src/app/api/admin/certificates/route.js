import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';
import AuditLog from '@/lib/models/AuditLog';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Helper to verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars');
  } catch (error) {
    return null;
  }
}

// GET all certificates
export async function GET(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const certificates = await Certificate.find()
      .sort({ createdAt: -1 })
      .limit(1000)
      .select('-verificationHash -__v');

    // Calculate stats
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats = {
      total: certificates.length,
      verified: certificates.filter(c => !c.isRevoked).length,
      revoked: certificates.filter(c => c.isRevoked).length,
      thisMonth: certificates.filter(c => new Date(c.createdAt) >= firstDayOfMonth).length,
    };

    return NextResponse.json({ certificates, stats });
  } catch (error) {
    console.error('Get certificates error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// POST create new certificate
export async function POST(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const certificateId = formData.get('certificateId');
    const recipientName = formData.get('recipientName');
    const program = formData.get('program');
    const programCategory = formData.get('programCategory');
    const awardDate = formData.get('awardDate');
    const certificateFile = formData.get('certificateFile');

    // Validate required fields
    if (!certificateId || !recipientName || !program || !programCategory) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if certificate ID already exists
    const existing = await Certificate.findOne({ certificateId: certificateId.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'Certificate ID already exists' },
        { status: 409 }
      );
    }

    let certificateFileId = null;
    let certificateFileName = null;

    // Handle file upload
    if (certificateFile && certificateFile.size > 0) {
      const bytes = await certificateFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate random file ID
      certificateFileId = crypto.randomBytes(16).toString('hex');
      const extension = path.extname(certificateFile.name);
      certificateFileName = certificateFileId + extension;

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'certificates');
      await mkdir(uploadsDir, { recursive: true });

      // Save file
      const filePath = path.join(uploadsDir, certificateFileName);
      await writeFile(filePath, buffer);
    }

    // Create certificate
    const certificate = new Certificate({
      certificateId: certificateId.toUpperCase(),
      recipientName: recipientName.trim(),
      recipientEmail: null, // Optional now
      program,
      programCategory,
      awardDate: awardDate ? new Date(awardDate) : new Date(),
      issuedBy: 'STEM CS Club',
      createdBy: user.username,
      certificateFileId,
      certificateFileName,
    });

    await certificate.save();

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Log action
    await AuditLog.create({
      action: 'CREATE',
      entityType: 'CERTIFICATE',
      entityId: certificate._id,
      performedByUsername: user.username,
      ipAddress: clientIP,
      status: 'SUCCESS',
      details: {
        certificateId,
        recipientName,
        program,
        hasFile: !!certificateFileId,
      },
    }).catch(() => {}); // Don't fail if audit log fails

    return NextResponse.json({
      success: true,
      certificate,
    }, { status: 201 });
  } catch (error) {
    console.error('Create certificate error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
