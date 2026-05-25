import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';

function getScoutingPlaceholder(name: string, description: string): string {
  const query = `${name} ${description}`.toLowerCase();
  
  if (query.includes('forest') || query.includes('wood') || query.includes('nature') || query.includes('tree')) {
    return 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop';
  }
  if (query.includes('desert') || query.includes('sand') || query.includes('dune') || query.includes('canyon')) {
    return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop';
  }
  if (query.includes('cyberpunk') || query.includes('city') || query.includes('neon') || query.includes('street') || query.includes('cyber')) {
    return 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=800&auto=format&fit=crop';
  }
  if (query.includes('warehouse') || query.includes('industrial') || query.includes('factory') || query.includes('abandoned')) {
    return 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?q=80&w=800&auto=format&fit=crop';
  }
  
  // Default cinematic film location placeholder
  return 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop';
}

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
    const { name, description, imageUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Location name is required.' }, { status: 400 });
    }

    // 4. Map to placeholder if no imageUrl is supplied
    const finalImageUrl = imageUrl && imageUrl.trim()
      ? imageUrl.trim()
      : getScoutingPlaceholder(name, description || '');

    // 5. Create Location record
    const location = await prisma.location.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        imageUrl: finalImageUrl,
        projectId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Location added successfully.',
        location,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Location POST error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while adding the location.' },
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

    // 3. Parse location ID to delete
    const { id: locationId } = await request.json();

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID is required for deletion.' },
        { status: 400 }
      );
    }

    // 4. Delete the Location record
    await prisma.location.delete({
      where: {
        id: locationId,
        projectId, // Double check it belongs to this project
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Location deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Location DELETE error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while deleting the location.' },
      { status: 500 }
    );
  }
}
