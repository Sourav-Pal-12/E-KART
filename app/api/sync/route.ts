import { NextResponse } from 'next/server';
import { getDB } from '@/lib/mongodb';
import { client } from '@/sanity/lib/client';

export async function POST() {
  try {
    const db = await getDB();
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');

    // Fetch all products from Sanity
    const sanityProducts = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        "slug": slug.current,
        images,
        description,
        price,
        discount,
        "categories": categories[]->title,
        stock,
        "brand": brand->title,
        status,
        variant,
        isFeatured
      }
    `);
    // Fetch all orders from Sanity
    const sanityOrders = await client.fetch(`
      *[_type == "order"] {
        _id,
        orderNumber,
        clerkUserId,
        customerName,
        email,
        products[]{
          "productId": product->_id,
          "sanityProductId": product->_id,
          "name": product->name,
          "price": product->price,
          quantity,
          "image": product->images[0]
        },
        totalPrice,
        currency,
        amountDiscount,
        address,
        status,
        orderDate
      }
    `);

    let productsSynced = 0;
    let ordersSynced = 0;

    // Insert products into MongoDB
    if (sanityProducts && sanityProducts.length > 0) {
      for (const product of sanityProducts) {
        const mongoProduct = {
          sanityId: product._id,
          name: product.name,
          slug: product.slug,
          images: product.images?.map((img: any) => img.asset?._ref) || [],
          description: product.description,
          price: product.price || 0,
          discount: product.discount || 0,
          categories: product.categories || [],
          stock: product.stock || 0,
          brand: product.brand,
          status: product.status || 'new',
          variant: product.variant || 'others',
          isFeatured: product.isFeatured || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await productsCollection.updateOne(
          { sanityId: product._id },
          { $set: mongoProduct },
          { upsert: true }
        );
        productsSynced++;
      }
    }

    // Insert orders into MongoDB
    if (sanityOrders && sanityOrders.length > 0) {
      for (const order of sanityOrders) {
        const mongoOrder = {
          sanityId: order._id,
          orderNumber: order.orderNumber,
          clerkUserId: order.clerkUserId,
          customerName: order.customerName,
          email: order.email,
          products: order.products || [],
          totalPrice: order.totalPrice || 0,
          currency: order.currency || 'USD',
          amountDiscount: order.amountDiscount || 0,
          address: order.address || {},
          status: order.status || 'pending',
          orderDate: order.orderDate ? new Date(order.orderDate) : new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await ordersCollection.updateOne(
          { sanityId: order._id },
          { $set: mongoOrder },
          { upsert: true }
        );
        ordersSynced++;
      }
    }
    
    return NextResponse.json({
      message: 'Sync completed successfully',
      synced: {
        products: productsSynced,
        orders: ordersSynced,
      },
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({
      error: 'Sync failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}