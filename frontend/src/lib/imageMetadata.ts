const imageMetadata: Record<string, { width: number; height: number }> = {
  "/city-hero-smaller-no-border.png": { width: 836, height: 470 },
  "/city-dark.png": { width: 1672, height: 941 },
  "/smart-city-hero.png": { width: 1717, height: 916 },
  "/shahrsazi.png": { width: 1672, height: 941 },
  "/urban-planning-legal-guide.webp": { width: 1055, height: 1491 },
  "/construction-supervision.webp": { width: 1376, height: 768 },
  "/smart-city-citizen-participation.webp": { width: 1536, height: 1024 },
  "/news-property-coefficient-1405.webp": { width: 1376, height: 768 },
  "/news-property-coefficient-1404.webp": { width: 1024, height: 1024 },
  "/news-renovation-rate-2-5.webp": { width: 1536, height: 1024 },
  "/product-article-77.jpg": { width: 1333, height: 640 },
  "/product-properties.png": { width: 1143, height: 552 },
  "/gis.png": { width: 1477, height: 378 },
  "/product-income.png": { width: 1449, height: 698 },
  "/product-article-100.jpg": { width: 1424, height: 1505 },
  "/product-guilds.png": { width: 1323, height: 838 },
  "/product-renovation.png": { width: 1431, height: 910 },
  "/product-payroll.png": { width: 1346, height: 589 },
  "/product-hr.png": { width: 1325, height: 581 },
  "/product-contracts.png": { width: 1335, height: 604 },
  "/product-accounting.png": { width: 1339, height: 614 },
  "/product-budget.png": { width: 1332, height: 550 },
  "/product-treasury.png": { width: 1340, height: 593 },
  "/hoghoghi.jpg": { width: 1500, height: 843 },
  "/daraeiha.jpg": { width: 1500, height: 843 },
  "/product-machinery-maintenance.jpeg": { width: 1352, height: 638 },
  "/product-citizenyar.jpg": { width: 1670, height: 872 },
};

export function getImageMetadata(src: string) {
  return imageMetadata[src];
}
