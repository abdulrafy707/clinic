// app/api/templates/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the import path as needed

// Create a new ObjectiveTemplate
export async function POST(request) {
  try {
    const { name, categories, doctorId } = await request.json();

    if (!name || !categories || !doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newTemplate = await prisma.objectiveTemplate.create({
      data: {
        name,
        categories, // Expecting this to be a JSON array
        doctorId,
      },
    });

    return NextResponse.json({ message: 'Template created successfully', template: newTemplate }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');

  try {
    // If doctorId is provided, filter templates by doctorId
    const templates = doctorId
      ? await prisma.objectiveTemplate.findMany({
          where: { doctorId: parseInt(doctorId) },
        })
      : await prisma.objectiveTemplate.findMany(); // Otherwise, return all templates

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: 'Failed to retrieve templates' }, { status: 500 });
  }
}
 

// export async function GET(request) {
//   try {
//     const templates = await prisma.objectiveTemplate.findMany(); // Use the correct model name here
//     return NextResponse.json({ templates }, { status: 200 });
//   } catch (error) {
//     console.error("Fetching error:", error);
//     return NextResponse.json({ error: 'Failed to retrieve templates' }, { status: 500 });
//   }
// }
