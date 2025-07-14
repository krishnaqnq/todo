import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Todo } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const todo = await Todo.create(data);
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
