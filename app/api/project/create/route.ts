import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authenticate the user session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { title, description } = body;

    // 3. Validation
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Project title is required.' }, { status: 400 });
    }

    // 4. Create the project linked to the authenticated user
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        userId: session.id,
      },
    });

    // 5. Return the created project
    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully.',
        project,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while creating the project.' },
      { status: 500 }
    );
  }
}
