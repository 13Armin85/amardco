import type { CertificateImage, ContentItem, ContentKind } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV ? 'http://127.0.0.1:4173/api' : '/api'
)

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function getContentList(kind: ContentKind) {
  const resource = kind === 'update' ? 'updates' : kind === 'news' ? 'news' : 'articles'
  return request<{ data: ContentItem[] }>(`/${resource}`).then(result => result.data)
}

export function getContentItem(kind: ContentKind, slug: string) {
  const resource = kind === 'update' ? 'updates' : kind === 'news' ? 'news' : 'articles'
  return request<{ data: ContentItem }>(`/${resource}/${slug}`).then(result => result.data)
}

export function getCertificates() {
  return request<{ data: CertificateImage[] }>('/certificates').then(result => result.data)
}
