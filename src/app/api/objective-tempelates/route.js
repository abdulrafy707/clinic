import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
export async function POST(request) {
  try {
    const body = await request.json(); // Parse JSON body
    const { name, categories, adminId } = body; // Extract data from request body

    // Check for missing fields
    if (!name || !categories || !adminId) {
      return NextResponse.json({ error: 'Name, categories, and admin ID are required' }, { status: 400 });
    }

    // Check if the admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!existingAdmin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Create the objective template
    const newTemplate = await prisma.objectiveTemplate.create({
      data: {
        name,
        categories, // Store as JSON string
        admin: { connect: { id: parseInt(adminId) } }, // Link to the admin
      },
    });

    return NextResponse.json({
      message: 'Objective template created successfully',
      template: {
        id: newTemplate.id,
        name: newTemplate.name,
        categories: categories, // Send back the categories as array
        adminId: newTemplate.adminId,
        createdAt: newTemplate.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating objective template:', error);
    return NextResponse.json({ error: 'Failed to create objective template' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch only objective templates that have an associated adminId
    const templates = await prisma.objectiveTemplate.findMany({
      where: {
        adminId: {
          not: null, // Ensures that only templates with an adminId are fetched
        },
      },
    });

    // Return the filtered templates in JSON format
    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving objective templates:', error);
    return NextResponse.json({ error: 'Failed to retrieve objective templates' }, { status: 500 });
  }
}