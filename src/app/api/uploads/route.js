import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export const runtime = 'nodejs';
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Function to transcribe audio using OpenAI's Whisper API
async function transcribeWithWhisper(file) {
  try {
    console.log('Sending audio to Whisper API...');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();
    formData.append('file', new Blob([buffer]), file.name || 'audio.webm');
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
      throw new Error(`OpenAI API error: ${response.statusText}, Details: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    if (!data.text) throw new Error('No text returned from Whisper API');

    console.log('Whisper API response:', data);
    return data.text;
  } catch (error) {
    console.error('Transcription failed:', error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
}

// Function to generate formatted output using GPT-4
async function generateFormattedOutput(transcriptionText, objectiveTemplate) {
  try {
    console.log('Generating formatted output with GPT-4...');
    
    // Check if objectiveTemplate.categories is an array; if not, use an empty array
    const objectiveFields = (Array.isArray(objectiveTemplate.categories) ? objectiveTemplate.categories : [])
      .map((field) => `- **${field}**: [Value or "Not mentioned"]`)
      .join('\n');

    const prompt = `
      You are a helpful assistant that organizes veterinary visit transcriptions into structured medical records based on this format:

      # **Subjective**
      [Owner's observations, patient history, and any reported issues.]

      # **Objective**
      ${objectiveFields}

      # **Assessment**
      [Professional assessment of the patient's condition.]

      # **Plan**
      1. [Recommended treatments, procedures, medications, or follow-up plans.]

      Based on the following transcription:

      "${transcriptionText}"

      Please extract relevant information and fill in each section accordingly, using Markdown formatting. If certain information is not mentioned, note it as "Not mentioned" or "Normal" as appropriate.
    `;

    const messages = [
      { role: 'system', content: 'Format transcription into structured sections.' },
      { role: 'user', content: prompt },
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
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GPT-4 API error:', errorData);
      throw new Error(`GPT-4 API error: ${response.statusText}, Details: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const formattedOutput = data.choices[0].message.content;

    // Extract each section from the formatted output using regex patterns
    const subjective = formattedOutput.match(/# \*\*Subjective\*\*\n([\s\S]*?)\n# \*\*Objective\*\*/)?.[1]?.trim() || "Not mentioned";
    const objective = formattedOutput.match(/# \*\*Objective\*\*\n([\s\S]*?)\n# \*\*Assessment\*\*/)?.[1]?.trim() || "Not mentioned";
    const assessment = formattedOutput.match(/# \*\*Assessment\*\*\n([\s\S]*?)\n# \*\*Plan\*\*/)?.[1]?.trim() || "Not mentioned";
    const plan = formattedOutput.match(/# \*\*Plan\*\*\n([\s\S]*)/)?.[1]?.trim() || "Not mentioned";

    // Parse the Objective section based on the template categories
    const objectiveFieldsParsed = {};
    (Array.isArray(objectiveTemplate.categories) ? objectiveTemplate.categories : []).forEach((field) => {
      objectiveFieldsParsed[field] = objective.match(new RegExp(`- \\*\\*${field}\\*\\*: (.*?)$`, "m"))?.[1]?.trim() || "Not mentioned";
    });

    return { subjective, objective: JSON.stringify(objectiveFieldsParsed), assessment, plan };
  } catch (error) {
    console.error('Formatted output generation failed:', error);
    throw new Error(`Formatted output generation failed: ${error.message}`);
  }
}

// Main handler for POST request
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');
    const patientName = formData.get('patientName') || null;
    const patientAddress = formData.get('patientAddress') || null;
    const templateId = formData.get('templateId');

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!templateId) return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });

    console.log('Received file size on server:', file.size, 'bytes');

    // Fetch the selected template
    const template = await prisma.objectiveTemplate.findUnique({
      where: { id: parseInt(templateId) },
    });

    if (!template) {
      throw new Error(`Template with ID ${templateId} not found.`);
    }

    // Step 1: Transcribe the audio using OpenAI's Whisper API
    const transcription = await transcribeWithWhisper(file);

    console.log('Transcription length:', transcription.length);

    // Step 2: Generate structured output
    const { subjective, objective, assessment, plan } = await generateFormattedOutput(transcription, template);

    // Step 3: Save the transcription and structured output in the database
    const savedRecord = await prisma.transcription.create({
      data: {
        filename: file.name || 'recording.webm',
        transcription,
        subjective,
        objective, // Now stores structured JSON for objective
        assessment,
        plan,
        patientName,
        patientAddress,
        userId: parseInt(userId),
        templateId: parseInt(templateId),
      },
    });

    console.log('Saved record ID:', savedRecord.id);

    // Step 4: Return structured transcription as JSON
    return NextResponse.json({
      message: 'Transcription and formatted output processed successfully.',
      transcription: savedRecord.transcription,
      subjective: savedRecord.subjective,
      objective: JSON.parse(savedRecord.objective),
      assessment: savedRecord.assessment,
      plan: savedRecord.plan,
    });
  } catch (error) {
    console.error('Error during transcription or formatted output generation:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
