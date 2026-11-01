export type ContentStatus = 'draft' | 'review' | 'published'

export type ProductDocument = {
  _id: string
  slug: string
  title: string
  description: string
  category: 'men' | 'women' | 'accessories'
  collections: string[]
  variants: Array<{ sku: string; size: string; color: string; price: number; inventory: number }>
  mediaIds: string[]
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
}

export type BlogDocument = {
  _id: string
  slug: string
  title: string
  excerpt: string
  body: string
  authorId: string
  featuredMediaId?: string
  tags: string[]
  status: ContentStatus
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export type MediaDocument = {
  _id: string
  key: string
  filename: string
  mimeType: string
  altText: string
  width?: number
  height?: number
  usedBy: Array<{ type: 'product' | 'blog'; id: string }>
  createdAt: Date
}

export type UserDocument = {
  _id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'invited' | 'suspended'
  lastActiveAt?: Date
  createdAt: Date
}

export const medixaCollections = ['products', 'blogs', 'media', 'users', 'activity_events'] as const
