// app/api/upload/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the import path as needed

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Function to transcribe audio using OpenAI's Whisper API
// Function to transcribe audio using OpenAI's Whisper API
async function transcribeWithWhisper(file) {
  try {
    console.log('Sending audio to Whisper API...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Whisper API error:', errorData);
      throw new Error(
        `OpenAI API returned error: ${response.statusText}, Details: ${JSON.stringify(
          errorData
        )}`
      );
    }

    const data = await response.json();
    console.log('Whisper API response:', data);
    return data.text; // Return the transcription text
  } catch (error) {
    console.error('Transcription failed:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

// Function to generate a summary using GPT-4
async function generateSummary(transcriptionText) {
  try {
    const messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant that summarizes transcriptions into concise summaries.',
      },
      {
        role: 'user',
        content: `
          Here is a transcription of a conversation or speech:

          "${transcriptionText}"

          Please provide a concise summary of the transcription.
        `,
      },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI GPT-4 API returned error: ${response.statusText}, Details: ${JSON.stringify(
          errorData
        )}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content; // Return the summary
  } catch (error) {
    console.error('Summary generation failed:', error);
    throw new Error(`Summary generation failed: ${error.message}`);
  }
}

// Main handler for POST request
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file'); // Get the audio file from the form data
    const userId = formData.get('userId'); // User ID
    const patientName = formData.get('patientName') || null; // Optional
    const patientAddress = formData.get('patientAddress') || null; // Optional

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Received file size on server:', file.size, 'bytes');

    // Step 1: Transcribe the audio using OpenAI's Whisper API
    const transcription = await transcribeWithWhisper(file);
    console.log('Transcription length:', transcription.length);

    // Step 2: Generate summary using GPT-4
    const summary = await generateSummary(transcription);
    console.log('Summary generated:', summary.length, 'characters');

    // Step 3: Save the transcription and summary in the database
    const savedRecord = await prisma.transcription.create({
      data: {
        filename: file.name || 'recording.webm',
        transcription,
        summary,
        patientName,
        patientAddress,
        userId: parseInt(userId),
      },
    });

    console.log('Saved record ID:', savedRecord.id);

    // Step 4: Return the transcription and summary as JSON
    return NextResponse.json({
      message: 'Transcription and summary processed successfully.',
      transcription: savedRecord.transcription,
      summary: savedRecord.summary,
    });
  } catch (error) {
    console.error('Error during transcription or summary generation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
