import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate user
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // 2. Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // 3. Parse and validate budget numbers
    const body = await request.json();
    const { totalEstimated, totalSpent } = body;

    const estimated = parseFloat(totalEstimated) || 0;
    const spent = parseFloat(totalSpent) || 0;

    if (estimated < 0 || spent < 0) {
      return NextResponse.json(
        { error: 'Budget values must be positive numbers.' },
        { status: 400 }
      );
    }

    // 4. Upsert the Budget record
    const existingBudget = await prisma.budget.findUnique({
      where: { projectId },
    });

    let budget;
    if (existingBudget) {
      budget = await prisma.budget.update({
        where: { id: existingBudget.id },
        data: {
          totalEstimated: estimated,
          totalSpent: spent,
        },
      });
    } else {
      budget = await prisma.budget.create({
        data: {
          totalEstimated: estimated,
          totalSpent: spent,
          projectId,
        },
      });
    }

    // Format Decimal values as numbers for client serialization
    const serializedBudget = {
      ...budget,
      totalEstimated: Number(budget.totalEstimated),
      totalSpent: Number(budget.totalSpent),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Budget details saved successfully.',
        budget: serializedBudget,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Budget API error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while updating the budget.' },
      { status: 500 }
    );
  }
}
