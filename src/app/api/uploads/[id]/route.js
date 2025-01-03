// app/api/uploads/[id]/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust the import path as needed
import fs from 'fs/promises';
import path from 'path';

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

  try {
    // Parse the form data
    const formData = await request.formData();

    // Extract fields from form data
    const subjective = formData.get('subjective');
    const objective = formData.get('objective');
    const assessment = formData.get('assessment');
    const plan = formData.get('plan');
    const patientName = formData.get('patientName');
    const patientAddress = formData.get('patientAddress');
    const note_title = formData.get('note_title');
    const additional_note = formData.get('additional_note');
    const attached_file = formData.get('attached_file');
    const attached_file_url_form = formData.get('attached_file_url');

    let attached_file_url = null;

    // Handle attached file upload
    if (attached_file && attached_file.size > 0) {
      // Read the file content
      const buffer = Buffer.from(await attached_file.arrayBuffer());
      const fileName = attached_file.name;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      // Ensure the upload directory exists
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);

      // Write the file to the upload directory
      await fs.writeFile(filePath, buffer);
      attached_file_url = `/uploads/${fileName}`;
    } else if (attached_file_url_form) {
      // Use existing attached file URL if no new file is uploaded
      attached_file_url = attached_file_url_form;
    }

    // Handle objective field
    let parsedObjective = undefined;
    if (objective) {
      try {
        parsedObjective = JSON.stringify(JSON.parse(objective));
      } catch (e) {
        parsedObjective = undefined;
      }
    }

    // Update the transcription in the database
    const updatedTranscription = await prisma.transcription.update({
      where: { id: parseInt(id) },
      data: {
        subjective: subjective || undefined,
        objective: parsedObjective,
        assessment: assessment || undefined,
        plan: plan || undefined,
        patientName: patientName || undefined,
        patientAddress: patientAddress || undefined,
        note_title: note_title || undefined,
        attached_file: attached_file_url || undefined,
        additional_note: additional_note || undefined,
      },
    });

    return NextResponse.json({
      message: 'Transcription updated successfully',
      transcription: {
        ...updatedTranscription,
        objective: updatedTranscription.objective ? JSON.parse(updatedTranscription.objective) : {},
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
