export type DocumentStatus = "completed" | "processing" | "failed" | "pending"

export interface KnowledgeDocument {
  id: string
  name: string
  status: DocumentStatus
  size: string
  chunkCount: number
  ingestionProgress: number
  uploadedAtRaw: string
  source: string
  owner: string
  collectionId?: string
  batchId?: string
  lastError?: string
}

export interface CitationLink {
  id: string | number
  chunkId: string
  documentId: string
  document: string
  page?: number
  contentPreview: string
  score?: number
}

export interface ChunkRecord {
  id: string | number
  content: string
  metadata?: Record<string, unknown>
}

export type RagPromptType = "short" | "long" | "v2"

export type RagMessageRole = "user" | "assistant"

export interface RagMessage {
  id: string | number
  role: RagMessageRole
  content: string
  citations: CitationLink[]
  timestamp?: string
  metadata?: {
    model?: string
    temperature?: number
    promptType?: RagPromptType
    collectionId?: string
    collectionName?: string
  }
  retrievedDocuments?: Array<{
    id: string
    chunkId: string
    documentId: string
    documentName: string
    snippet: string
    score?: number
    metadata?: Record<string, unknown>
  }>
}


