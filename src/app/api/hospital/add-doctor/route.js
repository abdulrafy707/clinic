import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust the path as needed
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

export async function POST(request) {
  try {
    const { name, email, phone, city, state, country, address, password, hospitalId } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !city || !state || !country || !address || !password || !hospitalId) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if the hospital exists
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    // Check if a user with the same email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'phone';
      return NextResponse.json({ error: `Doctor with this ${field} already exists` }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new doctor in the User table with email verification set to true
    const newDoctor = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        city,
        state,
        country,
        address,
        password: hashedPassword,
        role: 'DOCTOR',
        isEmailVerified: true,
        hospitals: {
          connect: { id: hospitalId }, // Link doctor to the specified hospital
        },
      },
    });

    return NextResponse.json({
      message: 'Doctor created and added to hospital successfully',
      doctor: newDoctor,
      hospitalId: hospitalId,
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding doctor to hospital:', error);
    return NextResponse.json({ error: 'Failed to add doctor to hospital' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany();

    return NextResponse.json({ hospitals }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving hospitals:', error);
    return NextResponse.json({ error: 'Failed to retrieve hospitals' }, { status: 500 });
  }
}