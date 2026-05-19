import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDB();
    const collections = await db.listCollections().toArray();
    return NextResponse.json({
      status: 'connected',
      dbName: db.databaseName,
      collections: collections.map(c => c.name),
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}