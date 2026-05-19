import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';
import { MongoOrder } from '@/models/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');
    const db = await getDB();
    const orders = db.collection<MongoOrder>('orders');

    let query: Record<string, unknown> = {};

    if (userId) {
      query = { clerkUserId: userId };
    }
    if (orderId) {
      query = { orderNumber: orderId };
    }

    const result = await orders.find(query).sort({ orderDate: -1 }).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDB();
    const orders = db.collection<MongoOrder>('orders');
    
    const order = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await orders.insertOne(order);
    return NextResponse.json({ ...order, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderNumber, status } = body;
    
    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number required' }, { status: 400 });
    }
    
    const db = await getDB();
    const orders = db.collection<MongoOrder>('orders');
    
    const result = await orders.updateOne(
      { orderNumber },
      { $set: { status, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}