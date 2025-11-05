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
  id: string
  chunkId: string
  documentId: string
  document: string
  page?: number
  contentPreview: string
  score?: number
}

export interface SemanticSearchHit {
  id: string
  chunkId: string
  documentId: string
  document: string
  snippet: string
  similarity: number
  metadata?: {
    page?: number
    section?: string
    chapter?: number
    createdAt?: string
  }
}

export interface ChunkRecord {
  id: string
  content: string
  metadata?: {
    document: string
    documentId: string
    page?: number
    section?: string
    tokens?: number
    score?: number
  }
}

export type RagPromptType = "short" | "long" | "v2"

export interface KnowledgeCollection {
  id: string
  name: string
  description: string
}

export interface RetrievedDocument {
  id: string
  documentId: string
  documentName: string
  chunkId: string
  snippet: string
  score?: number
  collectionId?: string
  metadata?: {
    page?: number
    section?: string
  }
}

export interface SimulateRagOptions {
  collectionId?: string
  promptType?: RagPromptType
  model?: string
  temperature?: number
}

export const DEFAULT_COLLECTION_ID = "core"

export const knowledgeCollections: KnowledgeCollection[] = [
  {
    id: DEFAULT_COLLECTION_ID,
    name: "Base Produit",
    description: "Documentation principale du produit et spécifications techniques.",
  },
  {
    id: "support",
    name: "Support Client",
    description: "Articles de la base de connaissance destinée au support et à la réussite client.",
  },
  {
    id: "operations",
    name: "Opérations & Process",
    description: "Procédures internes, playbooks et guides de déploiement.",
  },
]

export interface OrganizationRecord {
  id: string
  name: string
  plan: "Starter" | "Pro" | "Enterprise"
  members: number
  projects: number
  role: "Admin" | "Editor" | "Viewer"
  updatedAt: string
}

export interface ProjectRecord {
  id: string
  organizationId: string
  name: string
  status: "active" | "paused" | "archived"
  documents: number
  queries: number
  apiKeyLastFour: string
  createdAt: string
  lastActivity: string
  apiKey: string
}

export interface EvaluationMetricsSnapshot {
  averageRetrievalGrade: number
  averageGenerationGrade: number
  totalEvaluations: number
  lastEvaluated: string
  retrievalMetrics: Array<{ label: string; value: number; percentage: number }>
  generationMetrics: Array<{ label: string; value: number; percentage: number }>
}

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "doc_product_specs",
    name: "Product Specifications.pdf",
    status: "completed",
    size: "2.3 MB",
    chunkCount: 45,
    ingestionProgress: 100,
    uploadedAtRaw: "2025-01-15T10:30:00Z",
    source: "Secure upload",
    owner: "Jane Smith",
    collectionId: DEFAULT_COLLECTION_ID,
    batchId: "batch-2025-01-15",
  },
  {
    id: "doc_user_manual",
    name: "User Manual v2.docx",
    status: "processing",
    size: "1.8 MB",
    chunkCount: 0,
    ingestionProgress: 65,
    uploadedAtRaw: "2025-01-15T11:45:00Z",
    source: "API",
    owner: "Operations Bot",
    collectionId: "support",
  },
  {
    id: "doc_technical_doc",
    name: "Technical Documentation.pdf",
    status: "completed",
    size: "5.7 MB",
    chunkCount: 128,
    ingestionProgress: 100,
    uploadedAtRaw: "2025-01-14T09:15:00Z",
    source: "Secure upload",
    owner: "Carlos Alvarez",
    collectionId: DEFAULT_COLLECTION_ID,
  },
  {
    id: "doc_api_reference",
    name: "API Reference.md",
    status: "failed",
    size: "450 KB",
    chunkCount: 0,
    ingestionProgress: 32,
    uploadedAtRaw: "2025-01-14T14:20:00Z",
    source: "GitHub sync",
    owner: "Automation",
    collectionId: "operations",
    lastError: "Invalid frontmatter section at line 154",
  },
]

export const knowledgeChunksByDocument: Record<string, ChunkRecord[]> = {
  doc_product_specs: [
    {
      id: "chunk_specs_01",
      content:
        "The v3 platform introduces real-time inference with latency under 120ms at p95, meeting enterprise SLA requirements.",
      metadata: {
        document: "Product Specifications.pdf",
        documentId: "doc_product_specs",
        page: 1,
        section: "Executive Summary",
        tokens: 215,
        score: 0.96,
      },
    },
    {
      id: "chunk_specs_02",
      content:
        "Scalable architecture leverages auto-scaling workers with horizontal sharding to support up to 10k concurrent sessions.",
      metadata: {
        document: "Product Specifications.pdf",
        documentId: "doc_product_specs",
        page: 3,
        section: "Scalability",
        tokens: 198,
        score: 0.91,
      },
    },
    {
      id: "chunk_specs_03",
      content:
        "Security controls include end-to-end encryption (TLS 1.3), role-based access enforced via OAuth scopes, and audit trails.",
      metadata: {
        document: "Product Specifications.pdf",
        documentId: "doc_product_specs",
        page: 5,
        section: "Security",
        tokens: 205,
        score: 0.89,
      },
    },
  ],
  doc_technical_doc: [
    {
      id: "chunk_tech_01",
      content:
        "Minimum hardware specification for on-prem deployment: 4 vCPU, 16GB RAM, NVMe storage, and GPU with 12GB VRAM.",
      metadata: {
        document: "Technical Documentation.pdf",
        documentId: "doc_technical_doc",
        page: 12,
        section: "Requirements",
        tokens: 189,
        score: 0.9,
      },
    },
    {
      id: "chunk_tech_02",
      content: "Service mesh relies on mTLS certificates rotated every 24 hours via HashiCorp Vault integration.",
      metadata: {
        document: "Technical Documentation.pdf",
        documentId: "doc_technical_doc",
        page: 27,
        section: "Infrastructure",
        tokens: 142,
        score: 0.87,
      },
    },
  ],
  doc_api_reference: [
    {
      id: "chunk_api_01",
      content:
        "Endpoint POST /v1/ingest accepts multipart uploads with fields {file, metadata, parser}, returning job_id for tracking.",
      metadata: {
        document: "API Reference.md",
        documentId: "doc_api_reference",
        page: 1,
        section: "Endpoints",
        tokens: 173,
        score: 0.88,
      },
    },
  ],
}

export const semanticSearchResults: SemanticSearchHit[] = [
  {
    id: "search_hit_01",
    chunkId: "chunk_specs_01",
    documentId: "doc_product_specs",
    document: "Product Specifications.pdf",
    snippet:
      "The v3 platform introduces real-time inference with latency under 120ms at p95, meeting enterprise SLA requirements.",
    similarity: 0.95,
    metadata: { page: 1, section: "Executive Summary", chapter: 1 },
  },
  {
    id: "search_hit_02",
    chunkId: "chunk_tech_01",
    documentId: "doc_technical_doc",
    document: "Technical Documentation.pdf",
    snippet:
      "Minimum hardware specification for on-prem deployment: 4 vCPU, 16GB RAM, NVMe storage, and GPU with 12GB VRAM.",
    similarity: 0.89,
    metadata: { page: 12, section: "Requirements", chapter: 3 },
  },
  {
    id: "search_hit_03",
    chunkId: "chunk_api_01",
    documentId: "doc_api_reference",
    document: "API Reference.md",
    snippet:
      "Endpoint POST /v1/ingest accepts multipart uploads with fields {file, metadata, parser}, returning job_id for tracking.",
    similarity: 0.87,
    metadata: { page: 1, section: "Endpoints" },
  },
]

export const organizationsMock: OrganizationRecord[] = [
  {
    id: "org_acme",
    name: "Acme Corp",
    plan: "Enterprise",
    members: 18,
    projects: 6,
    role: "Admin",
    updatedAt: "2025-01-16T08:15:00Z",
  },
  {
    id: "org_tech_startup",
    name: "Tech Startup",
    plan: "Pro",
    members: 5,
    projects: 2,
    role: "Editor",
    updatedAt: "2025-01-15T16:42:00Z",
  },
]

export const projectsMock: ProjectRecord[] = [
  {
    id: "proj_support_kb",
    organizationId: "org_acme",
    name: "Customer Support KB",
    status: "active",
    documents: 45,
    queries: 1234,
    apiKeyLastFour: "8X2Q",
    createdAt: "2024-11-10",
    lastActivity: "2025-01-16T09:45:00Z",
    apiKey: "sk-proj-support-8X2Q-1a2b3c4d5e",
  },
  {
    id: "proj_product_docs",
    organizationId: "org_acme",
    name: "Product Documentation",
    status: "active",
    documents: 128,
    queries: 3456,
    apiKeyLastFour: "6M1A",
    createdAt: "2024-10-05",
    lastActivity: "2025-01-15T18:12:00Z",
    apiKey: "sk-proj-product-6M1A-5e4d3c2b1a",
  },
  {
    id: "proj_internal_wiki",
    organizationId: "org_tech_startup",
    name: "Internal Wiki",
    status: "paused",
    documents: 23,
    queries: 567,
    apiKeyLastFour: "4P9D",
    createdAt: "2024-12-01",
    lastActivity: "2025-01-14T21:05:00Z",
    apiKey: "sk-proj-wiki-4P9D-9d8c7b6a5e",
  },
]

export const evaluationSnapshot: EvaluationMetricsSnapshot = {
  averageRetrievalGrade: 9.2,
  averageGenerationGrade: 8.5,
  totalEvaluations: 1247,
  lastEvaluated: "2025-01-15T14:30:00Z",
  retrievalMetrics: [
    { label: "Precision", value: 9.5, percentage: 95 },
    { label: "Recall", value: 8.9, percentage: 89 },
    { label: "Relevance", value: 9.2, percentage: 92 },
  ],
  generationMetrics: [
    { label: "Accuracy", value: 8.7, percentage: 87 },
    { label: "Coherence", value: 8.9, percentage: 89 },
    { label: "Completeness", value: 8.0, percentage: 80 },
  ],
}

export const usageCostSnapshot = {
  totalCost: 127.5,
  tokensUsed: 2_847_500,
  estimatedCost: 145.2,
  breakdown: {
    embedding: 45.3,
    completion: 62.8,
    search: 12.4,
    storage: 7.0,
  },
  alerts: {
    threshold: 150,
    current: 127.5,
    isNearLimit: true,
  },
}

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
  retrievedDocuments?: RetrievedDocument[]
}

export const initialChatMessages: RagMessage[] = [
  {
    id: "assistant_welcome",
    role: "assistant",
    content:
      "Bonjour ! Pose-moi une question sur tes documents et je te donnerai une réponse sourcée avec les passages pertinents.",
    citations: [],
    timestamp: "À l'instant",
  },
]

export function getChunksForDocument(documentId: string) {
  return knowledgeChunksByDocument[documentId] ?? []
}

export function findChunkById(chunkId: string) {
  const allChunks = Object.values(knowledgeChunksByDocument).flat()
  return allChunks.find((chunk) => chunk.id === chunkId)
}

export function simulateRagResponse(query: string, options: SimulateRagOptions = {}): RagMessage {
  const lowerQuery = query.toLowerCase()
  const {
    collectionId,
    promptType = "short",
    model = "gpt-4o",
    temperature = 0.7,
  } = options

  const normalizedCollection = collectionId && collectionId !== "all" ? collectionId : undefined

  const documentById = new Map(knowledgeDocuments.map((doc) => [doc.id, doc]))

  const matchesCollection = (documentId: string) => {
    if (!normalizedCollection) return true
    const doc = documentById.get(documentId)
    const docCollection = doc?.collectionId ?? DEFAULT_COLLECTION_ID
    return docCollection === normalizedCollection
  }

  const relevantHits = semanticSearchResults.filter((hit) => {
    if (!matchesCollection(hit.documentId)) return false
    const snippet = hit.snippet.toLowerCase()
    const section = hit.metadata?.section?.toLowerCase() ?? ""
    return snippet.includes(lowerQuery) || section.includes(lowerQuery)
  })

  const fallbackHits = semanticSearchResults.filter((hit) => matchesCollection(hit.documentId))

  const hitsToUse = (relevantHits.length > 0 ? relevantHits : fallbackHits.length > 0 ? fallbackHits : semanticSearchResults).slice(0, 3)

  const citations = hitsToUse.map((hit, index) => ({
    id: `${hit.id}_${index}`,
    chunkId: hit.chunkId,
    documentId: hit.documentId,
    document: hit.document,
    page: hit.metadata?.page,
    contentPreview: hit.snippet.slice(0, 280),
    score: hit.similarity,
  }))

  const retrievedDocuments: RetrievedDocument[] = citations.map((citation, index) => {
    const chunk = findChunkById(citation.chunkId)
    const doc = documentById.get(citation.documentId)
    return {
      id: `${citation.chunkId}_${index}`,
      chunkId: citation.chunkId,
      documentId: citation.documentId,
      documentName: citation.document,
      snippet: chunk?.content ?? citation.contentPreview,
      score: citation.score,
      collectionId: doc?.collectionId ?? DEFAULT_COLLECTION_ID,
      metadata: {
        page: chunk?.metadata?.page ?? citation.page,
        section: chunk?.metadata?.section,
      },
    }
  })

  const promptFlavor =
    promptType === "long"
      ? "réponse détaillée"
      : promptType === "v2"
        ? "synthèse enrichie"
        : "réponse synthétique"

  const summarySentences = retrievedDocuments
    .map((doc) => `• ${doc.snippet}`)
    .join("\n")

  const collectionName = normalizedCollection
    ? knowledgeCollections.find((collection) => collection.id === normalizedCollection)?.name
    : undefined

  return {
    id: `assistant_${Date.now()}`,
    role: "assistant",
    content: `(${promptFlavor.toUpperCase()})\n${summarySentences}\n\nPose-moi d'autres questions ou ouvre une source pour voir le détail.`,
    citations,
    retrievedDocuments,
    metadata: {
      model,
      temperature,
      promptType,
      collectionId: normalizedCollection,
      collectionName,
    },
    timestamp: new Date().toLocaleTimeString(),
  }
}

export function formatDisplayDate(value: string) {
  return new Date(value).toLocaleString()
}

export function formatDisplayDateShort(value: string) {
  return new Date(value).toLocaleDateString()
}
