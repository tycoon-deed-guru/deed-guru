import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDocumentUpload, deleteDocument } from '$lib/server/workspace';

/**
 * POST /api/workspace/documents
 * Create a document upload record (actual file upload handled separately)
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { propertyId, filename, fileSize, fileType, mimeType, storageUrl, storageBucket, storagePath } =
			await request.json();

		if (!filename || !fileSize || !storageUrl) {
			return json({ error: 'File information required' }, { status: 400 });
		}

		const documentId = await createDocumentUpload(session.user.id, propertyId, {
			filename,
			fileSize,
			fileType,
			mimeType,
			storageUrl,
			storageBucket,
			storagePath,
		});

		return json({
			success: true,
			documentId,
		});
	} catch (error) {
		console.error('Error creating document upload:', error);
		return json({ error: 'Failed to create document' }, { status: 500 });
	}
};

/**
 * DELETE /api/workspace/documents
 * Delete a document
 */
export const DELETE: RequestHandler = async ({ request, locals }) => {
	const session = await locals.getSession();
	if (!session?.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { documentId } = await request.json();

		if (!documentId) {
			return json({ error: 'Document ID required' }, { status: 400 });
		}

		await deleteDocument(documentId);

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting document:', error);
		return json({ error: 'Failed to delete document' }, { status: 500 });
	}
};
