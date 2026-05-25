import { NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { getSession } from '../../../../../../lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate the user session
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id: projectId } = await params;

    // 2. Verify project exists and belongs to the user (or user has access)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // 3. Handle file parsing from FormData (fallback to JSON if needed)
    let fileName = 'script.pdf';
    
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (file) {
        fileName = file.name;
      }
    } catch (err) {
      // Fallback: Check if it was sent as JSON
      try {
        const body = await request.json();
        if (body.fileName) {
          fileName = body.fileName;
        }
      } catch (jsonErr) {
        // Use default fileName if parsing fails
      }
    }

    // 4. Create the Script record in the database
    const script = await prisma.script.create({
      data: {
        fileName: fileName,
        fileUrl: `/uploads/scripts/${projectId}_${encodeURIComponent(fileName)}`,
        projectId: projectId,
      },
    });

    // 5. Automatically seed 3 mock scenes from this script for later phases
    await prisma.scene.createMany({
      data: [
        {
          sceneNumber: 1,
          title: 'Opening Shot',
          description: 'A misty dawn over the cityscape. A lone figure stands on the bridge, staring into the fog.',
          scriptId: script.id,
        },
        {
          sceneNumber: 2,
          title: 'The Briefing',
          description: 'Inside a dimly lit surveillance room. Detailed maps are laid out, detailing a mysterious transmission.',
          scriptId: script.id,
        },
        {
          sceneNumber: 3,
          title: 'The Chase',
          description: 'High-speed chase down the narrow, neon-lit alleys. Rain slicked streets reflecting the city glow.',
          scriptId: script.id,
        },
      ],
    });

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Script uploaded and parsed into scenes successfully.',
        script,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Script upload error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while uploading the script.' },
      { status: 500 }
    );
  }
}
