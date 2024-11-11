// app/api/feedback/route.js

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust the import path if needed

// POST - Create a new feedback entry
export async function POST(request) {
  try {
    const { userId, hospitalId, name, message } = await request.json();

    // Validate the required fields
    if (!userId || !hospitalId || !name || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the feedback in the database
    const newFeedback = await prisma.feedback.create({
      data: {
        userId,
        hospitalId,
        name,
        message,
      },
    });

    return NextResponse.json({ message: 'Feedback created successfully', feedback: newFeedback }, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// GET - Retrieve all feedback, optionally filtered by userId or hospitalId
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const hospitalId = searchParams.get('hospitalId');

  try {
    // Build a where clause for optional filters
    const whereClause = {};
    if (userId) whereClause.userId = parseInt(userId);
    if (hospitalId) whereClause.hospitalId = parseInt(hospitalId);

    // Fetch feedback from the database based on filters
    const feedbackList = await prisma.feedback.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true } },        // Include the user name
        hospital: { select: { name: true } },    // Include the hospital name
      },
      orderBy: { createdAt: 'desc' },            // Order by most recent feedback
    });

    return NextResponse.json({ feedback: feedbackList }, { status: 200 });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to retrieve feedback' }, { status: 500 });
  }
}
