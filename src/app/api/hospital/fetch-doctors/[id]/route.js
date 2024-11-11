import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(request, { params }) {
  try {
    const hospitalId = parseInt(params.id);

    // Validate hospitalId
    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }

    // Check if the hospital exists
    const hospital = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    // Fetch all doctors associated with the hospital, including status
    const doctors = await prisma.user.findMany({
      where: {
        hospitals: {
          some: { id: hospitalId },
        },
        role: 'DOCTOR',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        country: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        status: true, // Include status in the response
      },
    });

    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    console.error('Error fetching doctors for hospital:', error);
    return NextResponse.json({ error: 'Failed to retrieve doctors' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const doctorId = parseInt(params.id);

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const { name, email, phone, city, state, country, address, status } = await request.json();

    // Check if doctor exists and is associated with a hospital
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Doctor not found or is not a doctor' }, { status: 404 });
    }

    // Update doctor details, including status
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
        status, // Update status field
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
