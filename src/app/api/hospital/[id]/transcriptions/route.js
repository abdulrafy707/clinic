// app/api/hospitals/[id]/transcriptions/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma'; // Adjust the import path as needed

// GET: Retrieve all transcriptions for doctors under a specific hospital
export async function GET(request, { params }) {
  const hospitalId = parseInt(params.id);

  try {
    // Validate the hospitalId
    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital ID is required' }, { status: 400 });
    }

    // Check if the hospital exists
    const hospitalExists = await prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospitalExists) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    // Fetch all transcriptions for doctors linked to the specified hospital
    const transcriptions = await prisma.transcription.findMany({
      where: {
        user: {
          hospitals: {
            some: { id: hospitalId }, // Check if the doctor is associated with the hospital
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ transcriptions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transcriptions for hospital:', error);
    return NextResponse.json({ error: 'Failed to retrieve transcriptions' }, { status: 500 });
  }
}
