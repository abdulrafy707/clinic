import { NextResponse } from 'next/server';

// Simulated database of transcriptions
const mockDatabase = {
  '1': { transcription: 'Sample transcription text', summary: 'Sample summary', keyPoints: ['Key point 1', 'Key point 2'] },
  '2': { transcription: 'Another transcription text', summary: 'Another summary', keyPoints: ['Key point A', 'Key point B'] },
};

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Fetch data by ID (replace with actual database query)
    const transcriptionData = mockDatabase[id];

    if (!transcriptionData) {
      return NextResponse.json({ error: 'Transcription not found' }, { status: 404 });
    }

    return NextResponse.json(transcriptionData);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching transcription data' }, { status: 500 });
  }
}
