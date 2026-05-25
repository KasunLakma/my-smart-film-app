import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';
import { CastCrewType } from '../../../../../app/generated/prisma';

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

    // 3. Parse and validate body
    const body = await request.json();
    const { name, type, roleName, email, phone } = body;

    if (!name || !name.trim() || !type || !roleName || !roleName.trim()) {
      return NextResponse.json(
        { error: 'Name, Type (CAST or CREW), and Role Name are required.' },
        { status: 400 }
      );
    }

    if (type !== 'CAST' && type !== 'CREW') {
      return NextResponse.json(
        { error: 'Type must be either CAST or CREW.' },
        { status: 400 }
      );
    }

    // 4. Create the CastCrew member
    const member = await prisma.castCrew.create({
      data: {
        name: name.trim(),
        type: type as CastCrewType,
        roleName: roleName.trim(),
        email: email ? email.trim() : null,
        phone: phone ? phone.trim() : null,
        projectId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Member added to directory successfully.',
        member,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Crew POST error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while adding the member.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // 3. Parse the member ID to delete
    const { id: memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required for deletion.' },
        { status: 400 }
      );
    }

    // 4. Delete the CastCrew member
    await prisma.castCrew.delete({
      where: {
        id: memberId,
        projectId, // Double check it belongs to this project
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Member removed from directory successfully.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Crew DELETE error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while deleting the member.' },
      { status: 500 }
    );
  }
}
