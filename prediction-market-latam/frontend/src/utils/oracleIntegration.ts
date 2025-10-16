import { Connection, PublicKey } from '@solana/web3.js';

export interface OracleData {
  oracleProvider: string;
  dataSource: string;
  value: string;
  confidence: number;
  timestamp: number;
}

export interface ChainlinkFeed {
  address: string;
  name: string;
  description: string;
  decimals: number;
  category: string;
}

// Chainlink feeds for LATAM-relevant data
export const CHAINLINK_FEEDS: Record<string, ChainlinkFeed> = {
  // Economic Indicators
  'USD_BRL': {
    address: '8A753747A1Fa494EC906cE90E9f37563A8AF630e',
    name: 'USD/BRL',
    description: 'US Dollar to Brazilian Real exchange rate',
    decimals: 8,
    category: 'Forex'
  },
  'USD_MXN': {
    address: 'CE4dFF978E5c5a0d8c1c2B9f4A8c3d5e6f7g8h9i',
    name: 'USD/MXN',
    description: 'US Dollar to Mexican Peso exchange rate',
    decimals: 8,
    category: 'Forex'
  },
  'USD_ARS': {
    address: 'ABc1234567890DEFghijkLMNOPqrstuvwxyz',
    name: 'USD/ARS',
    description: 'US Dollar to Argentine Peso exchange rate',
    decimals: 8,
    category: 'Forex'
  },
  
  // Commodities
  'GOLD_USD': {
    address: 'GOLD1234567890abcdefghijklmnopqrstuv',
    name: 'Gold/USD',
    description: 'Gold price in US Dollars',
    decimals: 8,
    category: 'Commodities'
  },
  'OIL_USD': {
    address: 'OIL1234567890abcdefghijklmnopqrstuv',
    name: 'Crude Oil/USD',
    description: 'Crude oil price in US Dollars',
    decimals: 8,
    category: 'Commodities'
  },
  
  // Weather Data
  'BRAZIL_RAINFALL': {
    address: 'RAIN1234567890abcdefghijklmnopqrstuv',
    name: 'Brazil Rainfall',
    description: 'Average rainfall in Brazil (mm)',
    decimals: 2,
    category: 'Weather'
  },
  'ARGENTINA_TEMPERATURE': {
    address: 'TEMP1234567890abcdefghijklmnopqrstuv',
    name: 'Argentina Temperature',
    description: 'Average temperature in Argentina (°C)',
    decimals: 1,
    category: 'Weather'
  }
};

export class OracleService {
  private connection: Connection;
  
  constructor(connection: Connection) {
    this.connection = connection;
  }

  async fetchChainlinkData(feedKey: string): Promise<OracleData | null> {
    try {
      const feed = CHAINLINK_FEEDS[feedKey];
      if (!feed) {
        throw new Error(`Feed ${feedKey} not found`);
      }

      // In a real implementation, you would fetch from the actual Chainlink feed
      // For now, we'll simulate the data
      const mockData: OracleData = {
        oracleProvider: 'Chainlink',
        dataSource: feed.address,
        value: this.generateMockValue(feedKey),
        confidence: 95,
        timestamp: Math.floor(Date.now() / 1000)
      };

      return mockData;
    } catch (error) {
      console.error('Error fetching Chainlink data:', error);
      return null;
    }
  }

  private generateMockValue(feedKey: string): string {
    // Generate realistic mock values based on feed type
    switch (feedKey) {
      case 'USD_BRL':
        return (Math.random() * 2 + 4).toFixed(2); // 4-6 BRL per USD
      case 'USD_MXN':
        return (Math.random() * 5 + 15).toFixed(2); // 15-20 MXN per USD
      case 'USD_ARS':
        return (Math.random() * 100 + 800).toFixed(2); // 800-900 ARS per USD
      case 'GOLD_USD':
        return (Math.random() * 200 + 1800).toFixed(2); // $1800-2000 per ounce
      case 'OIL_USD':
        return (Math.random() * 20 + 70).toFixed(2); // $70-90 per barrel
      case 'BRAZIL_RAINFALL':
        return (Math.random() * 50 + 100).toFixed(1); // 100-150mm
      case 'ARGENTINA_TEMPERATURE':
        return (Math.random() * 10 + 15).toFixed(1); // 15-25°C
      default:
        return '100';
    }
  }

  async fetchScientificData(topic: string): Promise<OracleData | null> {
    try {
      // Simulate fetching scientific data from APIs like:
      // - NASA Climate Data
      // - WHO Health Statistics
      // - World Bank Economic Data
      // - Academic Research APIs
      
      const mockScientificData: OracleData = {
        oracleProvider: 'Scientific API',
        dataSource: `https://api.scientific-data.com/${topic}`,
        value: this.generateScientificValue(topic),
        confidence: 90,
        timestamp: Math.floor(Date.now() / 1000)
      };

      return mockScientificData;
    } catch (error) {
      console.error('Error fetching scientific data:', error);
      return null;
    }
  }

  private generateScientificValue(topic: string): string {
    // Generate realistic scientific values
    switch (topic.toLowerCase()) {
      case 'climate':
        return (Math.random() * 2 + 1.5).toFixed(2); // Temperature increase in °C
      case 'deforestation':
        return (Math.random() * 1000 + 5000).toFixed(0); // Hectares lost
      case 'poverty':
        return (Math.random() * 10 + 20).toFixed(1); // Percentage
      case 'inflation':
        return (Math.random() * 15 + 5).toFixed(1); // Percentage
      default:
        return '50';
    }
  }

  async fetchGovernmentData(country: string, indicator: string): Promise<OracleData | null> {
    try {
      // Simulate fetching government data from official APIs
      const mockGovernmentData: OracleData = {
        oracleProvider: `${country} Government`,
        dataSource: `https://api.${country.toLowerCase()}.gov/${indicator}`,
        value: this.generateGovernmentValue(country, indicator),
        confidence: 98,
        timestamp: Math.floor(Date.now() / 1000)
      };

      return mockGovernmentData;
    } catch (error) {
      console.error('Error fetching government data:', error);
      return null;
    }
  }

  private generateGovernmentValue(country: string, indicator: string): string {
    // Generate realistic government statistics
    switch (indicator.toLowerCase()) {
      case 'gdp_growth':
        return (Math.random() * 4 - 2).toFixed(1); // -2% to +2% growth
      case 'unemployment':
        return (Math.random() * 10 + 5).toFixed(1); // 5-15% unemployment
      case 'inflation':
        return (Math.random() * 20 + 2).toFixed(1); // 2-22% inflation
      case 'population':
        return (Math.random() * 10000000 + 50000000).toFixed(0); // Population
      default:
        return '0';
    }
  }

  async validateOracleData(oracleData: OracleData): Promise<boolean> {
    // Validate oracle data integrity
    try {
      // Check timestamp is recent (within last 24 hours)
      const now = Math.floor(Date.now() / 1000);
      const dataAge = now - oracleData.timestamp;
      if (dataAge > 86400) { // 24 hours
        return false;
      }

      // Check confidence threshold
      if (oracleData.confidence < 80) {
        return false;
      }

      // Validate data source format
      if (!oracleData.dataSource || oracleData.dataSource.length < 10) {
        return false;
      }

      // Validate value format (should be numeric for most cases)
      const numericValue = parseFloat(oracleData.value);
      if (isNaN(numericValue)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating oracle data:', error);
      return false;
    }
  }

  async getAvailableFeeds(): Promise<ChainlinkFeed[]> {
    return Object.values(CHAINLINK_FEEDS);
  }

  async getFeedsByCategory(category: string): Promise<ChainlinkFeed[]> {
    return Object.values(CHAINLINK_FEEDS).filter(feed => feed.category === category);
  }
}

// Utility functions for oracle integration
export const formatOracleValue = (value: string, decimals: number): string => {
  const numValue = parseFloat(value);
  return (numValue / Math.pow(10, decimals)).toFixed(2);
};

export const calculateConfidenceScore = (oracleData: OracleData[]): number => {
  if (oracleData.length === 0) return 0;
  
  const totalConfidence = oracleData.reduce((sum, data) => sum + data.confidence, 0);
  return Math.round(totalConfidence / oracleData.length);
};

export const isOracleDataConsistent = (oracleData: OracleData[]): boolean => {
  if (oracleData.length < 2) return true;
  
  const values = oracleData.map(data => parseFloat(data.value));
  const average = values.reduce((sum, val) => sum + val, 0) / values.length;
  const maxDeviation = Math.max(...values.map(val => Math.abs(val - average) / average));
  
  // Consider data consistent if deviation is less than 10%
  return maxDeviation < 0.1;
};













