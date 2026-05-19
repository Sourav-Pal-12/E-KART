const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// const MONGODB_API = '/api/products';

export async function getProductsFromMongo() {
  try {
    const res = await fetch(`${BASE_URL}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('MongoDB fetch error:', error);
    return null;
  }
}

export async function getOrdersFromMongo(userId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/orders?userId=${userId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('MongoDB fetch error:', error);
    return null;
  }
}

export async function getUserFromMongo(userId: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/users?userId=${userId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error('MongoDB fetch error:', error);
    return null;
  }
}