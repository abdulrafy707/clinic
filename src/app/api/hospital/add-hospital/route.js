import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust the import path as needed

export async function POST(request) {
  try {
    const { name, address, city, state, country, phone, email, status = 'active' } = await request.json(); // Default to 'active'

    // Validate required fields
    if (!name || !address || !city || !state || !country || !phone || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate status field
    if (status !== 'active' && status !== 'inactive') {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Check if a hospital with the same email already exists
    const existingHospital = await prisma.hospital.findUnique({
      where: { email },
    });

    if (existingHospital) {
      return NextResponse.json({ error: 'Hospital with this email already exists' }, { status: 409 });
    }

    // Create a new hospital in the database with the specified or default status
    const newHospital = await prisma.hospital.create({
      data: {
        name,
        address,
        city,
        state,
        country,
        phone,
        email,
        status,
      },
    });

    return NextResponse.json({
      message: 'Hospital created successfully',
      hospital: newHospital,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating hospital:', error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all hospitals, including their status
    const hospitals = await prisma.hospital.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        country: true,
        phone: true,
        email: true,
        status: true, // Include the status field
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ hospitals }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving hospitals:', error);
    return NextResponse.json({ error: 'Failed to retrieve hospitals' }, { status: 500 });
  }
}
