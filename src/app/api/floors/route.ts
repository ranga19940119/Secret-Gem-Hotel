import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, level } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const floor = await prisma.floor.create({
      data: {
        name,
        level: parseInt(level) || 1
      }
    });

    return NextResponse.json(floor, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create floor' }, { status: 500 });
  }
}
