import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addChatMessage, getChatHistory, clearChatHistory } from '$lib/server/workspace';

/**
 * POST /api/workspace/chat
 * Add a chat message to the session
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { sessionId, role, content, metadata } = await request.json();

		if (!sessionId || !role || !content) {
			return json({ error: 'Session ID, role, and content required' }, { status: 400 });
		}

		// Add message
		await addChatMessage(sessionId, session.user.id, role, content, metadata);

		// Return updated chat history
		const messages = await getChatHistory(sessionId);

		return json({
			success: true,
			messages: messages.map((msg) => ({
				role: msg.role,
				content: msg.content,
				createdAt: msg.createdAt,
			})),
		});
	} catch (error) {
		console.error('Error adding chat message:', error);
		return json({ error: 'Failed to add message' }, { status: 500 });
	}
};

/**
 * DELETE /api/workspace/chat
 * Clear chat history for a session
 */
export const DELETE: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { sessionId } = await request.json();

		if (!sessionId) {
			return json({ error: 'Session ID required' }, { status: 400 });
		}

		await clearChatHistory(sessionId);

		return json({ success: true });
	} catch (error) {
		console.error('Error clearing chat history:', error);
		return json({ error: 'Failed to clear chat' }, { status: 500 });
	}
};
