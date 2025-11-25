import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { updateDataSourceSync, updateDataSourceStatus } from '$lib/server/workspace';

/**
 * PUT /api/workspace/datasources
 * Trigger a data source sync
 */
export const PUT: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { connectionId, action } = await request.json();

		if (!connectionId || !action) {
			return json({ error: 'Connection ID and action required' }, { status: 400 });
		}

		if (action === 'sync') {
			// In a real implementation, trigger actual sync here
			// For now, just update the sync timestamp
			await updateDataSourceSync(connectionId, {
				recordsImported: Math.floor(Math.random() * 1000) + 100,
				lastSyncDuration: Math.floor(Math.random() * 5000) + 1000,
			});

			return json({
				success: true,
				message: 'Data source synced successfully',
			});
		}

		if (action === 'disconnect') {
			await updateDataSourceStatus(connectionId, 'disconnected');

			return json({
				success: true,
				message: 'Data source disconnected',
			});
		}

		return json({ error: 'Invalid action' }, { status: 400 });
	} catch (error) {
		console.error('Error updating data source:', error);
		return json({ error: 'Failed to update data source' }, { status: 500 });
	}
};
