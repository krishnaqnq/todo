import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Todo } from '@/lib/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const todo = await Todo.findById(params.id);
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    if (!id) {
      return NextResponse.json({ error: 'Todo ID is required' }, { status: 400 });
    }

    await connectDB();
    const data = await request.json();

    // Clean up temporary IDs in items array
    if (data.items) {
      data.items = data.items.map((item: any) => {
        // If the item has a temporary ID, remove it so MongoDB can generate a new one
        if (item._id && item._id.startsWith('temp_')) {
          const { _id, ...itemWithoutId } = item;
          return itemWithoutId;
        }
        return item;
      });
    }
    
    const todo = await Todo.findByIdAndUpdate(
      id,
      { $set: data },
      { 
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const todo = await Todo.findByIdAndDelete(params.id);
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
