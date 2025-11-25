import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser } from '$lib/server/auth/supabase';
import { db } from '$lib/server/db';
import { properties } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async (event) => {
	const user = await getUser(event);

	// If not authenticated, return empty array
	if (!user) {
		return json({ deals: [] });
	}

	// Fetch user's properties
	const deals = await db
		.select()
		.from(properties)
		.where(eq(properties.userId, user.id))
		.orderBy(desc(properties.uploadedAt));

	return json({ deals });
};
