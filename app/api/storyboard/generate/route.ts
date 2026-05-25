import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';

function getPlaceholderImage(description: string, sceneNumber: number): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('bridge') || desc.includes('mist') || desc.includes('dawn')) {
    return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop';
  }
  if (desc.includes('room') || desc.includes('briefing') || desc.includes('surveillance') || desc.includes('monitor')) {
    return 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80&w=800&auto=format&fit=crop';
  }
  if (desc.includes('chase') || desc.includes('neon') || desc.includes('alley') || desc.includes('streets') || desc.includes('rain')) {
    return 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop';
  }

  // Generic cinematic image variations based on scene number
  const generics = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop'
  ];
  return generics[sceneNumber % generics.length];
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    // 2. Parse request payload
    const body = await request.json();
    const { sceneId, description, sceneNumber, title } = body;

    if (!sceneId || !description) {
      return NextResponse.json(
        { error: 'Scene ID and scene description are required.' },
        { status: 400 }
      );
    }

    // 3. Construct detailed cinematic prompt based on description
    const calculatedNumber = sceneNumber || 1;
    const calculatedTitle = title || 'Untitled Scene';
    const promptUsed = `Cinematic storyboard frame, 90s film look, anamorphic lens, scene ${calculatedNumber}: "${calculatedTitle}". ${description}. Dark moody lighting, volumetric fog, color graded, highly detailed sketch, movie concept art.`;

    // 4. Determine image URL via keyword analyzer
    const imageUrl = getPlaceholderImage(description, calculatedNumber);

    // Simulate network delay to make the "AI painting" process feel realistic (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 5. Save/Upsert storyboard frame in database
    const existingStoryboard = await prisma.storyboard.findFirst({
      where: { sceneId },
    });

    let storyboard;
    if (existingStoryboard) {
      storyboard = await prisma.storyboard.update({
        where: { id: existingStoryboard.id },
        data: {
          imageUrl,
          promptUsed,
          createdAt: new Date(),
        },
      });
    } else {
      storyboard = await prisma.storyboard.create({
        data: {
          imageUrl,
          promptUsed,
          sceneId,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Storyboard frame generated successfully.',
        storyboard,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Storyboard generation error:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred during storyboard generation.' },
      { status: 500 }
    );
  }
}
