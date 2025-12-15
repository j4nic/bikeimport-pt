export enum Availability {
  IN_STOCK = 'Auf Lager',
  LOW_STOCK = 'Geringer Bestand',
  OUT_OF_STOCK = 'Nicht vorrätig',
  PRE_ORDER = 'Vorbestellung'
}

export interface CompetitorPrice {
  competitorName: 'Galaxus' | 'Velofactory';
  price: number;
  availability: Availability;
  url: string;
  lastUpdated: string;
}

export interface Article {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  costPrice: number;
  ownPrice: number;
  ownAvailability: Availability;
  competitors: CompetitorPrice[];
  // Computed fields for fast rendering
  priceIndex: number; // 100 = market avg, <100 cheaper, >100 expensive
  minCompetitorPrice: number;
  gapToCheapest: number; // Percentage
  gapToCheapestAbs: number; // Absolute value
}

export interface CategoryStat {
  name: string;
  totalArticles: number;
  matchedArticles: number; // How many have at least 1 competitor match
  avgPriceIndex: number;
  cheaperCount: number;
  expensiveCount: number;
}

export interface KPIData {
  totalArticles: number;
  coverageRate: number; // % of articles with matches
  globalPriceIndex: number;
  potentialRevenueOpp: number; // Theoretical gain by raising prices where we are too cheap
}