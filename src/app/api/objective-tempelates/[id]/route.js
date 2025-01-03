import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Adjust the path as necessary

// GET - Retrieve a specific objective template by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Find the objective template by ID
    const template = await prisma.objectiveTemplate.findUnique({
      where: { id: parseInt(id) },
    });

    if (!template) {
      return NextResponse.json({ error: 'Objective template not found' }, { status: 404 });
    }

    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving objective template:', error);
    return NextResponse.json({ error: 'Failed to retrieve objective template' }, { status: 500 });
  }
}

// PUT - Update a specific objective template by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, categories, adminId } = body;

    // Validate required fields
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

    // Update the objective template
    const updatedTemplate = await prisma.objectiveTemplate.update({
      where: { id: parseInt(id) },
      data: {
        name,
        categories, // Store as JSON string
        admin: { connect: { id: parseInt(adminId) } },
      },
    });

    return NextResponse.json({
      message: 'Objective template updated successfully',
      template: {
        id: updatedTemplate.id,
        name: updatedTemplate.name,
        categories: categories, // Send back categories as array
        adminId: updatedTemplate.adminId,
        updatedAt: updatedTemplate.updatedAt,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating objective template:', error);
    return NextResponse.json({ error: 'Failed to update objective template' }, { status: 500 });
  }
}

// DELETE - Delete a specific objective template by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Delete the objective template by ID
    await prisma.objectiveTemplate.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: 'Objective template deleted successfully',
      templateId: id,
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting objective template:', error);
    return NextResponse.json({ error: 'Failed to delete objective template' }, { status: 500 });
  }
}
