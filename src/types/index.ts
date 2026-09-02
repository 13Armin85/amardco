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

export interface Project {
  id: string
  slug: string
  title: string
  category: ProductCategory
  client?: string
  description: string
  products: string[]
}
