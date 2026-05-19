import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';
import { MongoUser } from '@/models/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clerkUserId = searchParams.get('userId');
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const db = await getDB();
    const users = db.collection<MongoUser>('users');
    
    const user = await users.findOne({ clerkUserId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkUserId, email, name, image } = body;
    
    const db = await getDB();
    const users = db.collection<MongoUser>('users');
    
    const existingUser = await users.findOne({ clerkUserId });
    
    if (existingUser) {
      return NextResponse.json(existingUser);
    }
    
    const user: MongoUser = {
      clerkUserId,
      email,
      name,
      image,
      addresses: [],
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await users.insertOne(user);
    return NextResponse.json({ ...user, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { clerkUserId, wishlist, addresses } = body;
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const db = await getDB();
    const users = db.collection<MongoUser>('users');
    
    const updateFields: Record<string, unknown> = { updatedAt: new Date() };
    
    if (wishlist) {
      updateFields.wishlist = wishlist;
    }
    if (addresses) {
      updateFields.addresses = addresses;
    }
    
    const result = await users.updateOne(
      { clerkUserId },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const user = await users.findOne({ clerkUserId });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}