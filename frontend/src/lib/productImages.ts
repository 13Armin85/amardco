const productImages: Partial<Record<string, string>> = {
  "article-77": "/product-article-77.jpg",
  properties: "/product-properties.png",
  gis: "/gis.png",
  income: "/product-income.png",
  "article-100": "/product-article-100.jpg",
  guilds: "/product-guilds.png",
  renovation: "/product-renovation.png",
  payroll: "/product-payroll.png",
  hr: "/product-hr.png",
  contracts: "/product-contracts.png",
  accounting: "/product-accounting.png",
  budget: "/product-budget.png",
  treasury: "/product-treasury.png",
  checks: "/smart-city-hero.png",
  legal: "/hoghoghi.jpg",
  "fixed-assets": "/daraeiha.jpg",
  warehouse: "/smart-city-hero.png",
  taxpayers: "/smart-city-hero.png",
  "machinery-maintenance": "/product-machinery-maintenance.jpeg",
  citizenyar: "/product-citizenyar.jpg",
};

export function getProductImage(productId: string) {
  return productImages[productId];
}
