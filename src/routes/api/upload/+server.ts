import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth/supabase';
import { extractPropertyData, extractTextFromFile } from '$lib/server/ai/extractor';
import { db } from '$lib/server/db';
import { properties, users } from '$lib/server/db/schema';
import { calculatedeed.guruScore, totalScore, letterGrade } from '$lib/types';
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

		// Calculate deed.guru scores
		const scores = calculatedeed.guruScore({
			...extracted,
			id: '',
			uploadedAt: new Date(),
		});
		const total = totalScore(scores);
		const grade = letterGrade(total).grade;

		// Save to database
		const [newProperty] = await db
			.insert(properties)
			.values({
				id: crypto.randomUUID(),
				userId: user.id,
				name: extracted.name,
				address: extracted.address,
				units: extracted.units,
				rawData: extracted,
				scores,
				totalScore: total,
				grade,
				year1CoC: extracted.year1CoC.toString(),
				projectedIRR: extracted.projectedIRR.toString(),
				rentGrowthCAGR: extracted.rentGrowthCAGR.toString(),
				popJobGrowth: extracted.popJobGrowth.toString(),
				valueAddPotential: extracted.valueAddPotential.toString(),
				dscr: extracted.dscr.toString(),
				submarketScore: extracted.submarketScore,
				exitCapCompressionBps: extracted.exitCapCompressionBps,
				economicResilience: extracted.economicResilience,
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
