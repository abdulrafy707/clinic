import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// POST - Create a new Pricing Plan
export async function POST(request) {
    try {
      const { name, description, price, billingCycle, features } = await request.json();
  
      if (!name || !price || !billingCycle || !features) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      const newPricingPlan = await prisma.pricingPlan.create({
        data: {
          name,
          description,
          price: parseFloat(price), // Ensure price is stored as a Float
          billingCycle,
          features,
        },
      });
  
      return NextResponse.json({ message: 'Pricing Plan created successfully', plan: newPricingPlan }, { status: 201 });
    } catch (error) {
      console.error('Error creating pricing plan:', error);
      return NextResponse.json({ error: 'Internal Server Error: ' + error.message }, { status: 500 });
    }
  }

// GET - Retrieve all Pricing Plans
export async function GET() {
  try {
    const pricingPlans = await prisma.pricingPlan.findMany();
    return NextResponse.json({ plans: pricingPlans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json({ error: 'Failed to retrieve pricing plans' }, { status: 500 });
  }
}

// PATCH - Update a Pricing Plan by ID
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));
  const { name, description, price, billingCycle, features } = await request.json();

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  try {
    const updatedPlan = await prisma.pricingPlan.update({
      where: { id },
      data: { name, description, price, billingCycle, features },
    });
    return NextResponse.json({ message: 'Pricing Plan updated successfully', plan: updatedPlan }, { status: 200 });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    return NextResponse.json({ error: 'Failed to update pricing plan' }, { status: 500 });
  }
}

// DELETE - Remove a Pricing Plan by ID
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id'));

  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  try {
    await prisma.pricingPlan.delete({ where: { id } });
    return NextResponse.json({ message: 'Pricing Plan deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    return NextResponse.json({ error: 'Failed to delete pricing plan' }, { status: 500 });
  }
}
