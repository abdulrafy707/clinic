import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';// Adjust the import path as needed

// Fetch templates based on doctorId
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');

  if (!doctorId) {
    return NextResponse.json({ error: 'doctorId query parameter is required' }, { status: 400 });
  }

  try {
    const templates = await prisma.objectiveTemplate.findMany({
      where: { doctorId: parseInt(doctorId) },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates by doctorId:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}


// Update a specific template by ID
export async function PUT(request, { params }) {
  const { id } = params;
  const { name, categories } = await request.json();

  try {
    const updatedTemplate = await prisma.objectiveTemplate.update({
      where: { id: parseInt(id) },
      data: {
        name,
        categories, // Expecting this to be a JSON array
      },
    });

    return NextResponse.json({ message: 'Template updated successfully', template: updatedTemplate });
  } catch (error) {
    console.error('Error updating template:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// Delete a specific template by ID
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.objectiveTemplate.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}
