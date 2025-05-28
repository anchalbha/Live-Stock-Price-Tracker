
import { Stock } from "@/components/StockList";

// This would typically come from an environment variable
const TWELVE_DATA_API_KEY = "46c43f6d399e457585031c8dbc1d6d2e";
const API_BASE_URL = "https://api.twelvedata.com";

interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  previous_close: number;
  percent_change: number;
}

export async function searchStocks(query: string): Promise<Stock[]> {
  try {
    // In a real implementation, we would use the search endpoint
    // For demo purposes, we'll create a mock response
    
    // Example stocks you might search for
    const demoStocks: Record<string, Stock> = {
      'AAPL': {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 172.39,
        change: 1.42,
        changePercent: 0.83
      },
      'MSFT': {
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        price: 329.68,
        change: -1.29,
        changePercent: -0.39
      },
      'GOOGL': {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 135.37,
        change: 2.05,
        changePercent: 1.54
      },
      'AMZN': {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 127.56,
        change: -0.87,
        changePercent: -0.68
      },
      'META': {
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        price: 305.22,
        change: 4.15,
        changePercent: 1.38
      },
      'TSLA': {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 246.93,
        change: -5.42,
        changePercent: -2.15
      }
    };
    
    // Filter stocks based on the query
    if (query) {
      query = query.toUpperCase();
      return Object.values(demoStocks).filter(
        stock => stock.symbol.includes(query) || stock.name.toUpperCase().includes(query)
      );
    } else {
      // Return popular stocks if no query is provided
      return Object.values(demoStocks);
    }
    
    // In a real implementation with the TwelveData API, we would use code like this:
    /*
    const response = await fetch(
      `${API_BASE_URL}/stocks?symbol=${query}&source=docs&exchange=NASDAQ&country=United%20States&apikey=${TWELVE_DATA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stocks');
    }
    
    const data = await response.json();
    
    if (data.status === "ok" && data.data) {
      // Transform the response to match our Stock interface
      return data.data.map((stock: any) => ({
        symbol: stock.symbol,
        name: stock.name,
        price: 0, // We need to fetch prices separately
        change: 0,
        changePercent: 0,
      }));
    }
    */
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

export async function getStockData(symbol: string): Promise<Array<{ date: string; value: number }>> {
  try {
    // In a real implementation, we would fetch from the TwelveData API
    // For demo purposes, we'll create mock data
    const today = new Date();
    const mockData = [];
    
    // Generate 30 days of mock data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Base price depends on the symbol to make different stocks have different ranges
      let basePrice = 100;
      if (symbol === 'AAPL') basePrice = 170;
      if (symbol === 'MSFT') basePrice = 330;
      if (symbol === 'GOOGL') basePrice = 135;
      if (symbol === 'AMZN') basePrice = 125;
      if (symbol === 'META') basePrice = 300;
      if (symbol === 'TSLA') basePrice = 245;
      
      // Add some randomness to create realistic looking price movements
      const randomChange = (Math.random() - 0.45) * 10;
      const value = basePrice + randomChange + (i * 0.5);
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return mockData;
    
    // In a real implementation with the TwelveData API, we would use code like this:
    /*
    const response = await fetch(
      `${API_BASE_URL}/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${TWELVE_DATA_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }
    
    const data = await response.json();
    
    if (data.status === "ok" && data.values) {
      // Transform the response
      return data.values.map((item: any) => ({
        date: item.datetime,
        value: parseFloat(item.close),
      }));
    }
    */
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
}
