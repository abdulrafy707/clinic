import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import { FormatAlignJustifyOutlined } from '@mui/icons-material';



export async function GET() {
    try {
      const admin = await prisma.admin.findMany();
  
      return NextResponse.json({ admin }, { status: 200 });
    } catch (error) {
      console.error('Error retrieving admin:', error);
      return NextResponse.json({ error: 'Failed to retrieve admin' }, { status: 500 });
    }
  }

export async function POST(request) {
  try {
    const body = await request.text(); // Read raw text from request
    const { name, email, phone, password } = JSON.parse(body); // Parse it manually

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check for duplicate admin by email or phone
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingAdmin) {
      const field = existingAdmin.email === email ? 'email' : 'phone';
      return NextResponse.json({ error: `Admin with this ${field} already exists` }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin in the database
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'Admin created successfully',
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        phone: newAdmin.phone,
        createdAt: newAdmin.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
