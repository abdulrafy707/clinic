import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Log request details for debugging
    console.log('Incoming request...');

    // Parse the incoming request
    const body = await request.json();
    const { name, email, phoneNumber, city, state, country, address, role, password } = body;

    // Log parsed data for debugging
    console.log('Received data:', body);

    // Check for required fields
    if (!name || !email || !phoneNumber || !city || !state || !country || !role || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        city,
        state,
        country,
        address,
        role,
        emailVerified: true, // Default to verified for now
        password: hashedPassword,
      },
    });

    console.log('User created:', newUser);

    // Return the newly created user
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error.message);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
