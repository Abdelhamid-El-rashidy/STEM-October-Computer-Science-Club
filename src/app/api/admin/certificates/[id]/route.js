import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import Certificate from '@/lib/models/Certificate';
import AuditLog from '@/lib/models/AuditLog';

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

// DELETE certificate
export async function DELETE(request, { params }) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const certificate = await Certificate.findById(params.id);
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    await Certificate.findByIdAndDelete(params.id);

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Log action
    await AuditLog.create({
      action: 'DELETE',
      entityType: 'CERTIFICATE',
      entityId: params.id,
      performedByUsername: user.username,
      ipAddress: clientIP,
      status: 'SUCCESS',
      details: {
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Delete certificate error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

// PATCH update certificate (for revoke/restore)
export async function PATCH(request, { params }) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { action, reason } = body;

    const certificate = await Certificate.findById(params.id);
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    if (action === 'revoke') {
      certificate.isRevoked = true;
      certificate.revokedAt = new Date();
      certificate.revocationReason = reason || 'No reason provided';
      await certificate.save();

      await AuditLog.create({
        action: 'REVOKE',
        entityType: 'CERTIFICATE',
        entityId: params.id,
        performedByUsername: user.username,
        ipAddress: clientIP,
        status: 'SUCCESS',
        details: { reason },
      }).catch(() => {});

      return NextResponse.json({ success: true, message: 'Certificate revoked', certificate });
    } else if (action === 'restore') {
      certificate.isRevoked = false;
      certificate.revokedAt = null;
      certificate.revocationReason = null;
      await certificate.save();

      await AuditLog.create({
        action: 'UPDATE',
        entityType: 'CERTIFICATE',
        entityId: params.id,
        performedByUsername: user.username,
        ipAddress: clientIP,
        status: 'SUCCESS',
        details: { action: 'restore' },
      }).catch(() => {});

      return NextResponse.json({ success: true, message: 'Certificate restored', certificate });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update certificate error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
