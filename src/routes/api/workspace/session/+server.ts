import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateWorkspaceSession } from '$lib/server/workspace';

/**
 * PUT /api/workspace/session
 * Update workspace session (assumptions, sub-criteria, UI state)
 */
export const PUT: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const {
			sessionId,
			assumptions,
			subCriteriaValues,
			selectedAnalysisType,
			terminalOpen,
			terminalHeight,
		} = await request.json();

		if (!sessionId) {
			return json({ error: 'Session ID required' }, { status: 400 });
		}

		// Update session
		await updateWorkspaceSession(sessionId, {
			assumptions,
			subCriteriaValues,
			selectedAnalysisType,
			terminalOpen,
			terminalHeight,
		});

		return json({ success: true });
	} catch (error) {
		console.error('Error updating workspace session:', error);
		return json({ error: 'Failed to update session' }, { status: 500 });
	}
};
