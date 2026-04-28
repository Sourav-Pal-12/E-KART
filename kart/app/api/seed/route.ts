import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';

export async function POST() {
  try {
    const db = await getDB();

    // Create sample product
    const products = db.collection('products');
    const productResult = await products.insertOne({
      sanityId: 'sample-1',
      name: 'Sample Product',
      slug: 'sample-product',
      images: [],
      description: 'Sample product description',
      price: 99.99,
      discount: 10,
      categories: ['Electronics'],
      stock: 100,
      status: 'new',
      variant: 'gadget',
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create sample order
    const orders = db.collection('orders');
    const orderResult = await orders.insertOne({
      sanityId: 'order-1',
      orderNumber: 'ORD-001',
      clerkUserId: 'sample-user-123',
      customerName: 'John Doe',
      email: 'john@example.com',
      products: [{
        productId: productResult.insertedId.toString(),
        sanityProductId: 'sample-1',
        name: 'Sample Product',
        price: 99.99,
        quantity: 1,
      }],
      totalPrice: 89.99,
      currency: 'USD',
      amountDiscount: 10,
      address: {
        state: 'California',
        zip: '90001',
        city: 'Los Angeles',
        address: '123 Main St',
        name: 'John Doe',
      },
      status: 'pending',
      orderDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Create sample user
    const users = db.collection('users');
    const userResult = await users.insertOne({
      clerkUserId: 'sample-user-123',
      email: 'john@example.com',
      name: 'John Doe',
      image: '',
      addresses: [{
        state: 'California',
        zip: '90001',
        city: 'Los Angeles',
        address: '123 Main St',
        name: 'John Doe',
      }],
      wishlist: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Sample data created successfully',
      insertedIds: {
        product: productResult.insertedId,
        order: orderResult.insertedId,
        user: userResult.insertedId,
      },
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json({
      error: 'Failed to create sample data',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}