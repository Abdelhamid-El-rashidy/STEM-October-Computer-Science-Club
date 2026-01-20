import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Certificate from '@/lib/models/Certificate';
import AuditLog from '@/lib/models/AuditLog';
import { connectDB } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const certificateId = params.certificateId.toUpperCase().trim();
    
    // Validate format
    if (!/^\d{7}$/.test(certificateId)) {
      return NextResponse.json(
        { error: 'Invalid certificate ID format', verified: false },
        { status: 400 }
      );
    }

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Find certificate
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      // Log failed verification attempt
      await AuditLog.create({
        action: 'VERIFY',
        entityType: 'CERTIFICATE',
        entityId: certificateId,
        ipAddress: clientIP,
        status: 'FAILED',
        errorMessage: 'Certificate not found',
      });

      return NextResponse.json(
        {
          error: 'Not Found',
          message: 'Certificate not found in the system',
          verified: false,
        },
        { status: 404 }
      );
    }

    // Check if revoked
    if (certificate.isRevoked) {
      await AuditLog.create({
        action: 'VERIFY',
        entityType: 'CERTIFICATE',
        entityId: certificateId,
        ipAddress: clientIP,
        status: 'FAILED',
        errorMessage: 'Certificate revoked',
      });

      return NextResponse.json(
        {
          error: 'Revoked',
          message: 'This certificate has been revoked',
          verified: false,
          revokedAt: certificate.revokedAt,
          revocationReason: certificate.revocationReason,
        },
        { status: 410 }
      );
    }

    // Update verification count and track IP
    certificate.verificationCount = (certificate.verificationCount || 0) + 1;
    certificate.lastVerifiedAt = new Date();
    
    if (!certificate.verifiedIPs) certificate.verifiedIPs = [];
    if (!certificate.verifiedIPs.includes(clientIP)) {
      certificate.verifiedIPs.push(clientIP);
    }
    
    await certificate.save();

    // Log successful verification
    await AuditLog.create({
      action: 'VERIFY',
      entityType: 'CERTIFICATE',
      entityId: certificateId,
      ipAddress: clientIP,
      status: 'SUCCESS',
    });

    // Extract year and serial number from certificateId
    const year = '20' + certificateId.substring(0, 2);
    const serialNumber = parseInt(certificateId.substring(4, 7));

    // Return certificate data
    return NextResponse.json({
      verified: true,
      certificate: {
        certificateId: certificate.certificateId,
        recipientName: certificate.recipientName,
        program: certificate.program,
        programCategory: certificate.programCategory,
        awardDate: certificate.awardDate,
        issuedBy: certificate.issuedBy || 'STEM CS Club',
        year,
        serialNumber,
        verificationCount: certificate.verificationCount,
        certificateFileId: certificate.certificateFileId,
      },
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message, verified: false },
      { status: 500 }
    );
  }
}
