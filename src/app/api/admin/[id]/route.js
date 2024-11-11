import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import bcrypt from 'bcrypt';

// GET: Retrieve admin by ID
export async function GET(request, { params }) {
  const { id } = params;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Error retrieving admin:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin' }, { status: 500 });
  }
}

// PUT: Update admin by ID
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.text();
  const { name, email, phone, password } = JSON.parse(body);

  try {
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Check for duplicate email or phone (excluding the current admin)
    const duplicateAdmin = await prisma.admin.findFirst({
      where: {
        AND: [
          { id: { not: parseInt(id) } },
          { OR: [{ email }, { phone }] },
        ],
      },
    });

    if (duplicateAdmin) {
      const field = duplicateAdmin.email === email ? 'email' : 'phone';
      return NextResponse.json({ error: `Admin with this ${field} already exists` }, { status: 409 });
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingAdmin.password;

    // Update admin in the database
    const updatedAdmin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'Admin updated successfully',
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        updatedAt: updatedAdmin.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 });
  }
}

// DELETE: Delete admin by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Delete admin from the database
    await prisma.admin.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
