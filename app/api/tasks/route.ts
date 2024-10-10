import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

export async function GET() {
  await dbConnect();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  await dbConnect();
  const data = await request.json();
  const task = new Task(data);
  await task.save();
  return NextResponse.json(task);
}