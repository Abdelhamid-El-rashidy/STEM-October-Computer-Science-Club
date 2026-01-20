import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import AuditLog from '@/lib/models/AuditLog';

export async function POST(request) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check credentials from env for simple auth
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-in-production';

    if (username !== adminUsername || password !== adminPassword) {
      await AuditLog.create({
        action: 'LOGIN',
        entityType: 'ADMIN',
        ipAddress: clientIP,
        status: 'FAILED',
        errorMessage: 'Invalid credentials',
      }).catch(() => {}); // Don't fail if audit log fails

      return NextResponse.json(
        { error: 'Authentication Failed', message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    // Log successful login
    await AuditLog.create({
      action: 'LOGIN',
      entityType: 'ADMIN',
      performedByUsername: username,
      ipAddress: clientIP,
      status: 'SUCCESS',
    }).catch(() => {}); // Don't fail if audit log fails

    return NextResponse.json({
      success: true,
      token,
      user: { username, role: 'admin' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
