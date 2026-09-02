import { Link } from 'react-router-dom'
import {
  ArrowUpLeft,
  BadgeCheck,
  BadgeDollarSign,
  Building2,
  Calculator,
  ChartNoAxesCombined,
  FileSignature,
  FileText,
  HandCoins,
  Home,
  Landmark,
  Map,
  ReceiptText,
  Scale,
  Store,
  UsersRound,
  WalletCards,
  Warehouse,
} from 'lucide-react'
import type { Product } from '../types'

const icons = {
  BadgeCheck,
  BadgeDollarSign,
  Building2,
  Calculator,
  ChartNoAxesCombined,
  FileSignature,
  FileText,
  HandCoins,
  Home,
  Landmark,
  Map,
  ReceiptText,
  Scale,
  Store,
  UsersRound,
  WalletCards,
  Warehouse,
}

export default function ProductCard({ product }: { product: Product }) {
  const Icon = icons[product.icon as keyof typeof icons] || Building2

  return (
    <article className="product-card">
      <div className="product-icon"><Icon /></div>
      <span className="chip">{product.category}</span>
      <h3>{product.title}</h3>
      <p>{product.shortDescription}</p>
      <div className="feature-line">
        {product.features.slice(0, 3).map(feature => <span key={feature}>{feature}</span>)}
      </div>
      <Link to={`/products/${product.slug}`}>مشاهده محصول <ArrowUpLeft size={18} /></Link>
    </article>
  )
}
