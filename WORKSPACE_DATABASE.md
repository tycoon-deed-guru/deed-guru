# Workspace Database Integration

## Overview

The workspace page is now fully integrated with the Supabase database. All data including property analysis, underwriting assumptions, chat history, and documents are persisted to the database.

## Database Schema

### New Tables Created

#### `workspace_sessions`
Stores workspace state per property per user:
- `id` - Session identifier
- `userId` - User who owns the session
- `propertyId` - Property being analyzed
- `assumptions` - Underwriting assumptions (JSONB)
- `subCriteriaValues` - 8-petal sub-criteria values (JSONB)
- `selectedAnalysisType` - UI state ('petal' or 'underwriting')
- `terminalOpen` - AI copilot visibility
- `terminalHeight` - Terminal height in pixels

#### `chat_history`
AI copilot conversation history:
- `id` - Message identifier
- `sessionId` - Workspace session
- `userId` - Message author
- `role` - 'user' or 'assistant'
- `content` - Message text
- `metadata` - Optional metadata (model, tokens, etc.)

#### `document_uploads`
Tracks uploaded documents:
- `id` - Document identifier
- `userId` - Uploader
- `propertyId` - Associated property (optional)
- `filename`, `fileSize`, `fileType`, `mimeType`
- `storageUrl`, `storageBucket`, `storagePath` - File location
- `status` - Processing status (uploaded/processing/processed/failed)
- `extractedData` - AI-extracted data from document

#### `data_source_connections`
Tracks connected data sources:
- `id` - Connection identifier
- `userId` - User who created connection
- `sourceType` - Type (mls, yardi, realpage, costar, custom)
- `sourceName` - Display name
- `status` - Connection status
- `lastSyncAt` - Last sync timestamp
- `syncStats` - Sync statistics (JSONB)

## Setup Instructions

### 1. Generate and Apply Migration

```bash
# Generate migration for new workspace tables
bun run db:generate

# Push to database
bun run db:push
```

### 2. Verify Tables

```bash
# Open Drizzle Studio
bun run db:studio

# Check that these tables exist:
# - workspace_sessions
# - chat_history
# - document_uploads
# - data_source_connections
```

## API Routes

### Session Management

**PUT `/api/workspace/session`**
Update workspace session (assumptions, sub-criteria, UI state)

```typescript
await fetch('/api/workspace/session', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'ws-user-property',
    assumptions: { purchasePrice: 48500000, ... },
    subCriteriaValues: { cashflow: {...}, ... },
    selectedAnalysisType: 'petal',
    terminalOpen: true,
    terminalHeight: 250
  })
});
```

### Chat Management

**POST `/api/workspace/chat`**
Add a chat message

```typescript
await fetch('/api/workspace/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'ws-user-property',
    role: 'user',
    content: 'What is the bloom score?'
  })
});
```

**DELETE `/api/workspace/chat`**
Clear chat history

```typescript
await fetch('/api/workspace/chat', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'ws-user-property'
  })
});
```

### Document Management

**POST `/api/workspace/documents`**
Create document upload record

```typescript
await fetch('/api/workspace/documents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    propertyId: 'prop-austin-tech-towers',
    filename: 'document.pdf',
    fileSize: 2400000,
    fileType: 'pdf',
    mimeType: 'application/pdf',
    storageUrl: 'https://storage.supabase.co/...',
    storageBucket: 'documents',
    storagePath: 'user/property/document.pdf'
  })
});
```

**DELETE `/api/workspace/documents`**
Delete a document

### Data Source Management

**PUT `/api/workspace/datasources`**
Sync or disconnect data source

```typescript
await fetch('/api/workspace/datasources', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    connectionId: 'ds-user-mls-123',
    action: 'sync' // or 'disconnect'
  })
});
```

## Usage Example

### Workspace Page Load

The workspace page automatically loads all data from the database:

```typescript
// src/routes/(app)/workspace/+page.server.ts
export const load: PageServerLoad = async ({ locals, url }) => {
  const userId = locals.user.id;
  const propertyId = url.searchParams.get('property') || 'default';

  // Load property
  const property = await db.select()...

  // Get or create workspace session
  const workspaceSession = await getOrCreateWorkspaceSession(userId, propertyId);

  // Load chat history
  const chatMessages = await getChatHistory(workspaceSession.id);

  // Load documents
  const documents = await getPropertyDocuments(propertyId);

  // Load data sources
  const dataSources = await getDataSourceConnections(userId);

  return {
    property,
    workspaceSession,
    chatMessages,
    documents,
    dataSources
  };
};
```

### Saving Changes

Auto-save workspace state when user makes changes:

```typescript
// Debounced save function
let saveTimeout: ReturnType<typeof setTimeout>;

function autoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    await fetch('/api/workspace/session', {
      method: 'PUT',
      body: JSON.stringify({
        sessionId: data.workspaceSession.id,
        assumptions: underwritingAssumptions,
        subCriteriaValues: subCriteriaValues,
        selectedAnalysisType,
        terminalOpen,
        terminalHeight
      })
    });
  }, 1000); // Save 1 second after last change
}

// Trigger save on changes
$effect(() => {
  autoSave();
});
```

### Switching Properties

Navigate to different property workspace:

```typescript
async function selectProperty(propertyId: string) {
  await goto(`/workspace?property=${propertyId}`);
}
```

## Data Flow

```
User Action
    ↓
Component State Update
    ↓
Auto-save to Database (debounced)
    ↓
API Route (/api/workspace/...)
    ↓
Workspace Utility Function
    ↓
Database (Supabase)
```

## Features Now Persisted

✅ **Underwriting Assumptions**
- Purchase price, down payment, interest rate
- Rent growth, expense growth
- Exit cap rate, hold period
- All calculations automatically update

✅ **Petal Chart Sub-Criteria**
- All 8 petal categories (cashflow, appreciation, etc.)
- Individual sub-criteria values
- User can edit and scores recalculate

✅ **AI Copilot Chat**
- Full conversation history persisted
- Messages load on workspace open
- Can clear history

✅ **Documents**
- Upload tracking
- File metadata
- Processing status
- Association with properties

✅ **Data Sources**
- Connection status
- Last sync time
- Sync statistics

✅ **UI State**
- Selected analysis type (Petal vs Underwriting)
- Terminal open/closed
- Terminal height
- Expanded petal sections

## Next Steps

1. **File Upload Integration**
   - Integrate with Supabase Storage
   - Add drag-and-drop upload UI
   - Trigger AI extraction on upload

2. **Real-time Collaboration**
   - Add Supabase Realtime subscriptions
   - Show other users viewing same property
   - Live cursor/selection tracking

3. **Auto-save Indicator**
   - Show "Saving..." / "Saved" status
   - Handle offline mode
   - Conflict resolution

4. **Data Source Integrations**
   - Implement actual MLS/Yardi/RealPage connectors
   - OAuth flows for third-party services
   - Scheduled sync jobs

5. **AI Copilot Enhancement**
   - Stream AI responses
   - Show typing indicator
   - Support file attachments in chat
   - Integrate with Claude API

## Testing

```bash
# 1. Apply migrations
bun run db:push

# 2. Start dev server
bun run dev

# 3. Navigate to workspace
# http://localhost:5173/workspace

# 4. Test features:
# - Edit underwriting assumptions → Check auto-save
# - Send chat message → Check it persists
# - Switch properties → Check session loads
# - Open Drizzle Studio → Verify data in tables
```

## Troubleshooting

### Session not loading
- Check user is authenticated
- Verify property exists in database
- Check browser console for errors

### Chat messages not saving
- Verify sessionId is correct
- Check API route logs
- Ensure user has permission

### Auto-save not working
- Check network tab for API calls
- Verify debounce timeout is triggering
- Check for JavaScript errors

## Database Queries

### View all workspace sessions
```sql
SELECT
  ws.id,
  ws.property_id,
  p.name as property_name,
  ws.selected_analysis_type,
  ws.updated_at
FROM workspace_sessions ws
JOIN properties p ON ws.property_id = p.id
WHERE ws.user_id = 'user-id'
ORDER BY ws.updated_at DESC;
```

### View chat history for session
```sql
SELECT
  role,
  content,
  created_at
FROM chat_history
WHERE session_id = 'session-id'
ORDER BY created_at ASC;
```

### View documents by property
```sql
SELECT
  filename,
  file_size,
  status,
  uploaded_at
FROM document_uploads
WHERE property_id = 'property-id'
ORDER BY uploaded_at DESC;
```
