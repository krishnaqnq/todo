import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Todo } from '@/lib/models';

// GET a single todo by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const todo = await Todo.findById(id);

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

    const todo = await Todo.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });

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
    await connectDB();
    const { id } = await context.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
