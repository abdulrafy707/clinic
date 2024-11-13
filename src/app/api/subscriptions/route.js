import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// POST - Create a new Subscription
export async function POST(request) {
  try {
    const { userId, hospitalId, planId, startDate, endDate, isAutoRenewal } = await request.json();

    // Validation for required fields
    if (!planId || (!userId && !hospitalId)) {
      return NextResponse.json({ error: 'planId and either userId or hospitalId are required' }, { status: 400 });
    }

    // Check for an existing active subscription with the same plan for the user or hospital
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        planId,
        userId: userId || null,
        hospitalId: hospitalId || null,
        endDate: { gte: new Date() }, // Check for active subscriptions
      },
    });

    // If an active subscription exists, return a message instead of creating a new one
    if (existingSubscription) {
      return NextResponse.json({ message: 'You already have an active subscription to this plan' }, { status: 400 });
    }

    // Fetch the plan to check if it's a per-doctor hospital plan
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId },
    });

    // If the plan is per-doctor and the request is for a hospital, ensure the subscription is per doctor
    if (plan.perDoctor && hospitalId && !userId) {
      return NextResponse.json({
        error: 'This plan requires a doctor-specific subscription within the hospital',
      }, { status: 400 });
    }

    // Create the new subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        userId,
        hospitalId,
        planId,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isAutoRenewal: isAutoRenewal || false, // Set the auto-renewal flag
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
  
      // Retrieve subscriptions with the number of doctors per hospital if hospitalId is provided
      const subscriptions = await prisma.subscription.findMany({
        where: whereClause,
        include: {
          user: { select: { name: true, email: true } },
          hospital: {
            select: {
              name: true,
              email: true,
              users: {
                select: { id: true }, // Select doctor IDs to calculate count
              },
            },
          },
          plan: { select: { name: true, price: true, billingCycle: true, perDoctor: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
  
      // Calculate doctor count for each subscription's hospital and add it to the response
      const subscriptionsWithDoctorCount = subscriptions.map((subscription) => {
        const doctorCount = subscription.hospital ? subscription.hospital.users.length : 0;
        return {
          ...subscription,
          hospital: {
            ...subscription.hospital,
            doctorCount, // Add doctor count to the hospital info
          },
        };
      });
  
      return NextResponse.json({ subscriptions: subscriptionsWithDoctorCount }, { status: 200 });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return NextResponse.json({ error: 'Failed to retrieve subscriptions' }, { status: 500 });
    }
  }