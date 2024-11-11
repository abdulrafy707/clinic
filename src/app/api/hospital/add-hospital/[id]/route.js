import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma'; // Adjust the import path as needed

// GET - Retrieve a hospital by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const hospital = await prisma.hospital.findUnique({
      where: { id: parseInt(id) },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json({ hospital }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving hospital:', error);
    return NextResponse.json({ error: 'Failed to retrieve hospital' }, { status: 500 });
  }
}

// PUT - Update a hospital's details and status by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, address, city, state, country, phone, email, status } = await request.json();

    if (!name || !address || !city || !state || !country || !phone || !email || !status) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Update the hospital's details and status
    const updatedHospital = await prisma.hospital.update({
      where: { id: parseInt(id) },
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

    // Update the status of all associated doctors based on the new hospital status
    await prisma.user.updateMany({
      where: {
        hospitals: { some: { id: parseInt(id) } },
        role: 'DOCTOR',
      },
      data: { status: status },
    });

    return NextResponse.json({
      message: 'Hospital updated successfully',
      hospital: updatedHospital,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating hospital:', error);
    return NextResponse.json({ error: 'Failed to update hospital' }, { status: 500 });
  }
}

// DELETE - Delete a hospital by ID and set all associated doctors to inactive
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Set all doctors associated with the hospital to inactive
    await prisma.user.updateMany({
      where: {
        hospitals: { some: { id: parseInt(id) } },
        role: 'DOCTOR',
      },
      data: { status: 'inactive' },
    });

    // Delete the hospital
    await prisma.hospital.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: 'Hospital deleted successfully',
      hospitalId: id,
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    return NextResponse.json({ error: 'Failed to delete hospital' }, { status: 500 });
  }
}
