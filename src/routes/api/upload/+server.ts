import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth/supabase';
import { extractPropertyData, extractTextFromFile } from '$lib/server/ai/extractor';
import { db } from '$lib/server/db';
import { properties, users } from '$lib/server/db/schema';
import { calculateBloomScore, totalScore, letterGrade } from '$lib/types';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async (event) => {
	try {
		// Check authentication
		const user = await requireAuth(event);

		// Get or create user in database
		let dbUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
		if (!dbUser.length) {
			await db.insert(users).values({
				id: user.id,
				email: user.email!,
			});
		}

		// Parse form data
		const formData = await event.request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			throw error(400, 'No file uploaded');
		}

		// Extract text from file
		const documentText = await extractTextFromFile(file);

		// Use Vercel AI SDK to extract property data
		const extracted = await extractPropertyData(documentText);

		// Calculate 8-petal Bloom scores using all 40 sub-criteria
		const propertyId = crypto.randomUUID();
		const scores = calculateBloomScore({
			...extracted,
			id: propertyId,
			uploadedAt: new Date(),
		});
		const total = totalScore(scores);
		const grade = letterGrade(total).grade;

		// Save to database with Bloom scoring data
		const [newProperty] = await db
			.insert(properties)
			.values({
				id: propertyId,
				userId: user.id,
				name: extracted.name,
				address: extracted.address,
				units: extracted.units,
				rawData: extracted, // Store all 40 sub-criteria as JSON
				scores, // Array of 8 petal scores (0-8 each)
				totalScore: total, // Sum of all petal scores (0-64)
				grade, // Letter grade (A+, A, B+, B, C, F)
				documentType: 'om',
			})
			.returning();

		return json({
			success: true,
			property: newProperty,
		});
	} catch (err) {
		console.error('Upload error:', err);
		if (err instanceof Error) {
			throw error(500, err.message);
		}
		throw error(500, 'Failed to process upload');
	}
};
