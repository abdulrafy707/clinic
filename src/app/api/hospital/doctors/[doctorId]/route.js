import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma'; // Adjust the import path as needed

// Update a doctor’s details
export async function PUT(request, { params }) {
  try {
    const doctorId = parseInt(params.doctorId);
    const { name, email, phone, city, state, country, address } = await request.json();

    // Check if doctor exists and is associated with a hospital
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Doctor not found or is not a doctor' }, { status: 404 });
    }

    // Update doctor details
    const updatedDoctor = await prisma.user.update({
      where: { id: doctorId },
      data: {
        name,
        email,
        phone,
        city,
        state,
        country,
        address,
      },
    });

    return NextResponse.json({
      message: 'Doctor updated successfully',
      doctor: updatedDoctor,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}

// Delete a doctor
export async function DELETE(request, { params }) {
  try {
    const doctorId = parseInt(params.doctorId);

    // Check if doctor exists and is associated with a hospital
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Doctor not found or is not a doctor' }, { status: 404 });
    }

    // Delete the doctor record
    await prisma.user.delete({
      where: { id: doctorId },
    });

    return NextResponse.json({
      message: 'Doctor deleted successfully',
      doctorId: doctorId,
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting doctor:', error);
    return NextResponse.json({ error: 'Failed to delete doctor' }, { status: 500 });
  }
}
