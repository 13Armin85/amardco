export type ProductCategory = 'نرم‌افزار یکپارچه شهرسازی' | 'نرم‌افزار یکپارچه مالی و اداری' | 'سایر'

export interface Product {
  id: string
  slug: string
  title: string
  category: ProductCategory
  shortDescription: string
  description: string
  features: string[]
  capabilities: string[]
  icon: string
  featured?: boolean
  imageHint?: string
}

export interface Company {
  name: string
  shortName: string
  website: string
  tagline: string
  description: string
  phones: string[]
  email: string
  address: string
  areas: string[]
}

export type ContentKind = 'update' | 'news' | 'article'

export interface ContentItem {
  id: string
  slug: string
  kind: ContentKind
  title: string
  excerpt: string
  image: string
  imageAlt: string
  publishedAt: string
  body: string[]
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  sourcePdf?: string
}

export interface CertificateImage {
  id: string
  title: string
  image: string
  imageAlt: string
}
