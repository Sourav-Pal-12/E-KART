import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';
import { MongoProduct } from '@/models/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const db = await getDB();
    const products = db.collection<MongoProduct>('products');

    let query: Record<string, unknown> = {};

    if (slug) {
      query = { slug };
    }
    if (status) {
      query = { ...query, status };
    }
    if (featured === 'true') {
      query = { ...query, isFeatured: true };
    }

    const result = await products.find(query).sort({ name: 1 }).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDB();
    const products = db.collection<MongoProduct>('products');
    
    const product = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await products.insertOne(product);
    return NextResponse.json({ ...product, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}