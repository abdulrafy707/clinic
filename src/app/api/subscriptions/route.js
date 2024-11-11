import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// POST - Create a new Subscription
export async function POST(request) {
  try {
    const { userId, hospitalId, planId, startDate, endDate } = await request.json();

    if (!planId || (!userId && !hospitalId)) {
      return NextResponse.json({ error: 'planId and either userId or hospitalId are required' }, { status: 400 });
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        userId,
        hospitalId,
        planId,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json({ message: 'Subscription created successfully', subscription: newSubscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
  }
}

// GET - Retrieve all Subscriptions, optionally filtered by userId or hospitalId
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const hospitalId = searchParams.get('hospitalId');

  try {
    const whereClause = {};
    if (userId) whereClause.userId = parseInt(userId);
    if (hospitalId) whereClause.hospitalId = parseInt(hospitalId);

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } },
        hospital: { select: { name: true, email: true } },
        plan: { select: { name: true, price: true, billingCycle: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to retrieve subscriptions' }, { status: 500 });
  }
}
