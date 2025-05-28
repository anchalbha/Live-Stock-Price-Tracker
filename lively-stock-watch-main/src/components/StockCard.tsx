
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  onClick?: () => void;
  isWatchlisted?: boolean;
  onToggleWatchlist?: (symbol: string) => void;
}

const StockCard = ({ 
  symbol, 
  name, 
  price, 
  change, 
  changePercent,
  onClick,
  isWatchlisted = false,
  onToggleWatchlist
}: StockCardProps) => {
  const isPositive = change >= 0;

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(symbol);
    }
  };

  return (
    <Card 
      className={cn("card-hover cursor-pointer relative")}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{symbol}</CardTitle>
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            isPositive ? "stock-up" : "stock-down"
          )}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{isPositive ? "+" : ""}{changePercent.toFixed(2)}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-0">{name}</p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          <span className={cn(
            "text-sm",
            isPositive ? "stock-up" : "stock-down"
          )}>
            {isPositive ? "+" : ""}{change.toFixed(2)}
          </span>
        </div>
      </CardContent>
      
      {onToggleWatchlist && (
        <button 
          onClick={handleWatchlistClick}
          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-accent transition-colors"
          aria-label={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
          title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isWatchlisted ? 
            <EyeOff size={16} className="text-primary" /> : 
            <Eye size={16} className="text-muted-foreground" />
          }
        </button>
      )}
    </Card>
  );
};

export default StockCard;
