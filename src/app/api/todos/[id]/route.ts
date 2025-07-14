import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/lib/db';
import { Todo } from '@/lib/models';
import { authOptions } from '@/lib/auth';

// GET a single todo by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const { id } = await context.params;
    
    const todo = await Todo.findOne({ _id: id, user: session.user.id });
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

// PUT a single todo by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const { id } = await context.params;
    const data = await request.json();

    if (data.items) {
      data.items = data.items.map((item: any) => {
        if (item._id && item._id.startsWith('temp_')) {
          const { _id, ...itemWithoutId } = item;
          return itemWithoutId;
        }
        return item;
      });
    }
    
    // Find and update todo only if it belongs to the current user
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

// DELETE a single todo by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const { id } = await context.params;
    
    // Delete todo only if it belongs to the current user
    const todo = await Todo.findOneAndDelete({ _id: id, user: session.user.id });
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
