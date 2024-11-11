import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Adjust import path as needed

// Helper functions to get date ranges and counts
const getStartOfDay = (date) => new Date(date.setHours(0, 0, 0, 0));
const getStartOfMonth = (date) => new Date(date.setFullYear(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0));

export const GET = async (request) => {
  try {
    const now = new Date();

    console.log("Starting to fetch transcription counts...");

    // 1. Calculate daily data for the last 24 hours in 4-hour intervals
    const dailyCounts = await Promise.all(
      Array.from({ length: 6 }).map(async (_, i) => {
        const start = new Date(now.getTime() - i * 4 * 60 * 60 * 1000); // Subtract 4 hours
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
        console.log(`Daily interval ${i}: Start ${start}, End ${end}`);
        
        const count = await prisma.transcription.count({
          where: {
            createdAt: { gte: start, lt: end },
          },
        });
        return count;
      })
    ).then((counts) => counts.reverse());

    // 2. Calculate weekly data for each day in the last 7 days
    const weeklyCounts = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const start = getStartOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000)); // Start of each day
        const end = getStartOfDay(new Date(start.getTime() + 24 * 60 * 60 * 1000)); // End of the day
        console.log(`Weekly interval ${i}: Start ${start}, End ${end}`);

        const count = await prisma.transcription.count({
          where: {
            createdAt: { gte: start, lt: end },
          },
        });
        return count;
      })
    ).then((counts) => counts.reverse());

    // 3. Calculate monthly data for each day in the last 31 days
    const monthlyCounts = await Promise.all(
      Array.from({ length: 31 }).map(async (_, i) => {
        const start = getStartOfDay(new Date(now.getTime() - i * 24 * 60 * 60 * 1000));
        const end = getStartOfDay(new Date(start.getTime() + 24 * 60 * 60 * 1000));
        console.log(`Monthly interval ${i}: Start ${start}, End ${end}`);

        const count = await prisma.transcription.count({
          where: {
            createdAt: { gte: start, lt: end },
          },
        });
        return count;
      })
    ).then((counts) => counts.reverse());

    // 4. Calculate yearly data for each month in the last 12 months
    const yearlyCounts = await Promise.all(
      Array.from({ length: 12 }).map(async (_, i) => {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const start = getStartOfMonth(date);
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        console.log(`Yearly interval ${i}: Start ${start}, End ${end}`);

        const count = await prisma.transcription.count({
          where: {
            createdAt: { gte: start, lt: end },
          },
        });
        return count;
      })
    ).then((counts) => counts.reverse());

    console.log("Fetched transcription counts successfully.");
    return NextResponse.json({
      success: true,
      data: {
        dailyCounts,
        weeklyCounts,
        monthlyCounts,
        yearlyCounts,
      },
    });
  } catch (error) {
    console.error('Error fetching transcription counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve transcription counts' },
      { status: 500 }
    );
  }
};
