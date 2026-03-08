import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');
  
  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  // Default purge target for the collections
  revalidatePath('/[locale]/shop/[slug]', 'page');
  revalidatePath('/[locale]/product/[slug]', 'page');
  
  return NextResponse.json({ revalidated: true, message: 'purged dynamic routes', now: Date.now() });
}
