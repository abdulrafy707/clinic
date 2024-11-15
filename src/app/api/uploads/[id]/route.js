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

    // Parse objective field if it is stored as a JSON string
    transcription.objective = transcription.objective ? JSON.parse(transcription.objective) : null;

    return NextResponse.json(transcription);
  } catch (error) {
    console.error('Error retrieving transcription:', error);
    return NextResponse.json({ error: 'Error retrieving transcription' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const {
    subjective,
    objective,
    assessment,
    plan,
    patientName,
    patientAddress,
    note_title,
    attached_file,
    additional_note, // Add additional_note in the data payload
  } = await request.json();

  try {
    console.log("Received data for update:", {
      subjective,
      objective,
      assessment,
      plan,
      patientName,
      patientAddress,
      note_title,
      attached_file,
      additional_note,
    });

    const updatedTranscription = await prisma.transcription.update({
      where: { id: parseInt(id) },
      data: {
        subjective: subjective || undefined,
        objective: objective ? JSON.stringify(objective) : undefined,
        assessment: assessment || undefined,
        plan: plan || undefined,
        patientName: patientName || undefined,
        patientAddress: patientAddress || undefined,
        note_title: note_title || undefined,
        attached_file: attached_file || undefined,
        additional_note: additional_note || undefined, // Update additional_note
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
