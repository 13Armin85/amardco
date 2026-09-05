const productImages: Partial<Record<string, string>> = {
  "article-77": "/ماده-77.jpg",
  properties: "/مستغلات.png",
  gis: "/gis.png",
  income: "/درآمد.png",
  "article-100": "/ماده-100.jpg",
  guilds: "/اصناف.png",
  renovation: "/نوسازی.png",
  payroll: "/حقوق.png",
  hr: "/کارگزینی.png",
  contracts: "/قرارداد.png",
  accounting: "/حسابداری.png",
  budget: "/بودجه.png",
  treasury: "/خزانه.png",
  citizenyar: "/شهروندیار.jpg",
};

export function getProductImage(productId: string) {
  return productImages[productId];
}
