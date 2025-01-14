// app/api/templates/count-per-doctor/route.js
import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET() {
  try {
    const templateCounts = await prisma.objectiveTemplate.groupBy({
      by: ['doctorId'], // Group by doctorId instead of adminId
      where: { doctorId: { not: null } }, // Exclude templates with null doctorId
      _count: { id: true },
    });

    return NextResponse.json({ templateCounts });
  } catch (error) {
    console.error('Error fetching template counts:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

