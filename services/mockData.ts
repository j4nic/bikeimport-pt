import { Article, Availability, CompetitorPrice } from '../types';

const BRANDS = ['Shimano', 'SRAM', 'Bosch', 'Garmin', 'Thule', 'Continental', 'Schwalbe', 'Fox Racing'];
const CATEGORIES = ['Antrieb', 'Bremsen', 'E-Bike Systeme', 'Elektronik', 'Zubehör', 'Reifen', 'Federung'];

const generateRandomPrice = (base: number, variance: number) => {
  const change = base * (Math.random() * variance * 2 - variance);
  return Number((base + change).toFixed(2));
};

const getRandomAvailability = (): Availability => {
  const rand = Math.random();
  if (rand > 0.8) return Availability.OUT_OF_STOCK;
  if (rand > 0.6) return Availability.LOW_STOCK;
  return Availability.IN_STOCK;
};

// Generate 200 realistic items to simulate the list
export const generateMockData = (): Article[] => {
  const articles: Article[] = [];

  for (let i = 0; i < 200; i++) {
    const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const baseCost = Math.floor(Math.random() * 500) + 20; // 20 to 520
    const margin = 1.3 + (Math.random() * 0.4); // 30% to 70% margin
    const ownPrice = Number((baseCost * margin).toFixed(2));

    const competitors: CompetitorPrice[] = [];
    
    // Simulate Galaxus (Usually slightly more expensive or aggressive matching)
    if (Math.random() > 0.1) { // 90% match rate
      competitors.push({
        competitorName: 'Galaxus',
        price: generateRandomPrice(ownPrice, 0.15), // +/- 15%
        availability: getRandomAvailability(),
        url: '#',
        lastUpdated: '2025-10-24T08:00:00Z'
      });
    }

    // Simulate Velofactory (Specialist, usually competitive)
    if (Math.random() > 0.3) { // 70% match rate
      competitors.push({
        competitorName: 'Velofactory',
        price: generateRandomPrice(ownPrice, 0.10), // +/- 10%
        availability: getRandomAvailability(),
        url: '#',
        lastUpdated: '2025-10-24T09:30:00Z'
      });
    }

    // Calculations
    const competitorPrices = competitors.map(c => c.price);
    const minCompetitorPrice = competitorPrices.length > 0 ? Math.min(...competitorPrices) : ownPrice;
    
    // Price Index (Market = 100). If we are 110, we are 10% more expensive.
    // Formula: (Own / MarketAvg) * 100 OR (Own / MinCompetitor) * 100. 
    // For this app, we use strict comparison against the cheapest competitor found.
    const priceIndex = competitorPrices.length > 0 ? (ownPrice / minCompetitorPrice) * 100 : 100;

    const gapToCheapest = competitorPrices.length > 0 ? ((ownPrice - minCompetitorPrice) / minCompetitorPrice) * 100 : 0;
    const gapToCheapestAbs = competitorPrices.length > 0 ? ownPrice - minCompetitorPrice : 0;

    articles.push({
      id: `ART-${10000 + i}`,
      sku: `${brand.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
      name: `${brand} ${category} Component Pro ${i + 1}`,
      brand,
      category,
      costPrice: baseCost,
      ownPrice,
      ownAvailability: getRandomAvailability(),
      competitors,
      priceIndex,
      minCompetitorPrice,
      gapToCheapest,
      gapToCheapestAbs
    });
  }
  return articles;
};

// Simulate historical trend data
export const generateTrendData = () => {
  return [
    { name: 'Jan', index: 104 },
    { name: 'Feb', index: 103.5 },
    { name: 'Mär', index: 102 },
    { name: 'Apr', index: 101.8 },
    { name: 'Mai', index: 101.2 },
    { name: 'Jun', index: 100.5 },
  ];
};