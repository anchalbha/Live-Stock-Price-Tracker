
import React from 'react';
import StockCard from './StockCard';
import { Card, CardContent } from '@/components/ui/card';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface StockListProps {
  stocks: Stock[];
  isLoading: boolean;
  onSelectStock: (symbol: string) => void;
  watchlist?: string[];
  onToggleWatchlist?: (symbol: string) => void;
  watchlistOnly?: boolean;
}

const StockList: React.FC<StockListProps> = ({ 
  stocks, 
  isLoading, 
  onSelectStock, 
  watchlist = [], 
  onToggleWatchlist,
  watchlistOnly = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse-slow">
            <CardContent className="p-6">
              <div className="h-14 bg-muted/30 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const filteredStocks = watchlistOnly 
    ? stocks.filter(stock => watchlist.includes(stock.symbol))
    : stocks;
  
  if (watchlistOnly && !filteredStocks.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Your watchlist is empty. Add stocks to track them.</p>
      </div>
    );
  }

  if (!filteredStocks.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No stocks available. Try searching for a symbol.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredStocks.map((stock) => (
        <StockCard
          key={stock.symbol}
          symbol={stock.symbol}
          name={stock.name}
          price={stock.price}
          change={stock.change}
          changePercent={stock.changePercent}
          onClick={() => onSelectStock(stock.symbol)}
          isWatchlisted={watchlist.includes(stock.symbol)}
          onToggleWatchlist={onToggleWatchlist}
        />
      ))}
    </div>
  );
};

export default StockList;
