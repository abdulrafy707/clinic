// app/api/uploads/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust the import path as needed

export const runtime = 'nodejs'; // Ensure the API route runs in Node.js runtime

// GET: Retrieve a transcription by ID
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const transcription = await prisma.transcription.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transcription) {
      return NextResponse.json({ error: 'Transcription not found' }, { status: 404 });
    }

    return NextResponse.json(transcription);
  } catch (error) {
    console.error('Error retrieving transcription:', error);
    return NextResponse.json({ error: 'Error retrieving transcription' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { subjective, objective, assessment, plan, patientName, patientAddress } = await request.json();

  try {
    console.log("Received data for update:", { subjective, objective, assessment, plan, patientName, patientAddress });

    // Store objective as JSON string
    const updatedTranscription = await prisma.transcription.update({
      where: { id: parseInt(id) },
      data: {
        subjective: subjective || undefined,  // Use `undefined` to avoid updating with null if field is omitted
        objective: objective ? JSON.stringify(objective) : undefined,  // Check for undefined/null objective
        assessment: assessment || undefined,
        plan: plan || undefined,
        patientName: patientName || undefined,
        patientAddress: patientAddress || undefined,
      },
    });

    console.log("Updated transcription from Prisma:", updatedTranscription);

    return NextResponse.json({
      message: 'Transcription updated successfully',
      transcription: {
        ...updatedTranscription,
        objective: JSON.parse(updatedTranscription.objective || "{}"), // Parse JSON for response if exists
      },
    });
  } catch (error) {
    console.error('Error updating transcription:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Transcription not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error updating transcription' }, { status: 500 });
  }
}



// DELETE: Delete a transcription by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.transcription.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Transcription deleted successfully' });
  } catch (error) {
    console.error('Error deleting transcription:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Transcription not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error deleting transcription' }, { status: 500 });
  }
}
