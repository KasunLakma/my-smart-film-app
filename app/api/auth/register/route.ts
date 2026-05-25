import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { hashPassword } from '../../../../lib/auth';
import { Role } from '../../../../app/generated/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // 1. Basic validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields (email, password, name, role) are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = Object.values(Role);
    if (!validRoles.includes(role as Role)) {
      return NextResponse.json(
        { error: `Invalid role selected. Must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email address already exists.' },
        { status: 409 }
      );
    }

    // 3. Hash password and save user
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name.trim(),
        role: role as Role,
      },
    });

    // 4. Return success response (excluding password)
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred during registration.' },
      { status: 500 }
    );
  }
}
