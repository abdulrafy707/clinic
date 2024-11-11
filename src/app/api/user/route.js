import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; // To generate verification token
import { sendVerificationEmail } from '../../../../lib/sendVerificationEmail'; // Adjust import path

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, city, state, country, address, role, password } = body;

    if (!name || !email || !phone || !city || !state || !country || !role || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        city,
        state,
        country,
        address,
        role,
        password: hashedPassword,
        isEmailVerified: false, // Set to false until email verification
        verificationToken, // Save the token to the user
        verificationTokenExpires,
      },
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ message: 'User created successfully. Please check your email to verify your account.', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error.message);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}



// GET: Retrieve users, optionally filtered by role
export async function GET(request) {
  try {
    // Parse URL for query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // e.g., "DOCTOR" to filter by role

    // Retrieve users from the database
    const users = await prisma.user.findMany({
      where: role ? { role } : {}, // Apply role filter if provided
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        country: true,
        address: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
