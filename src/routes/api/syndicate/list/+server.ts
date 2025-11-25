import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { syndications } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/syndicate/list
 * List all active syndications or user's syndications
 */
export const GET: RequestHandler = async ({ url }) => {
	try {
		const userId = url.searchParams.get('userId');
		const status = url.searchParams.get('status');

		let query = db.query.syndications.findMany({
			with: {
				property: true,
				creator: {
					columns: {
						id: true,
						email: true
					}
				}
			},
			orderBy: [desc(syndications.createdAt)]
		});

		// Filter by user if provided
		if (userId) {
			const userSyndications = await db.query.syndications.findMany({
				where: eq(syndications.creatorUserId, userId),
				with: {
					property: true,
					investments: true
				},
				orderBy: [desc(syndications.createdAt)]
			});

			return json({
				success: true,
				syndications: userSyndications,
				count: userSyndications.length
			});
		}

		// Filter by status if provided
		if (status) {
			const statusSyndications = await db.query.syndications.findMany({
				where: eq(syndications.status, status),
				with: {
					property: true,
					creator: {
						columns: {
							id: true,
							email: true
						}
					}
				},
				orderBy: [desc(syndications.createdAt)]
			});

			return json({
				success: true,
				syndications: statusSyndications,
				count: statusSyndications.length
			});
		}

		// Default: Return all active syndications
		const allSyndications = await db.query.syndications.findMany({
			where: eq(syndications.status, 'active'),
			with: {
				property: true,
				creator: {
					columns: {
						id: true,
						email: true
					}
				}
			},
			orderBy: [desc(syndications.createdAt)]
		});

		return json({
			success: true,
			syndications: allSyndications,
			count: allSyndications.length
		});
	} catch (err) {
		console.error('List syndications error:', err);
		throw error(500, 'Failed to fetch syndications');
	}
};
