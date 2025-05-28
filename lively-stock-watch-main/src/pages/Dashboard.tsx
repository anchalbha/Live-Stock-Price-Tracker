
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StockList, { Stock } from '@/components/StockList';
import StockChart from '@/components/StockChart';
import StockDetails from '@/components/StockDetails';
import { searchStocks, getStockData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [detailStock, setDetailStock] = useState<Stock | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load initial popular stocks and watchlist from localStorage
  useEffect(() => {
    const loadInitialStocks = async () => {
      try {
        setIsLoadingStocks(true);
        const stocksData = await searchStocks('');
        setStocks(stocksData);
        
        // Load watchlist from localStorage
        const savedWatchlist = localStorage.getItem('stockWatchlist');
        if (savedWatchlist) {
          setWatchlist(JSON.parse(savedWatchlist));
        }
        
        // Select the first stock by default
        if (stocksData.length > 0 && !selectedStock) {
          setSelectedStock(stocksData[0].symbol);
          loadStockData(stocksData[0].symbol);
        }
      } catch (error) {
        console.error('Failed to load stocks:', error);
        toast({
          title: "Error",
          description: "Failed to load stocks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStocks(false);
      }
    };

    loadInitialStocks();
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSearch = async (query: string) => {
    try {
      setIsLoadingStocks(true);
      const results = await searchStocks(query);
      setStocks(results);
      
      if (results.length > 0) {
        setSelectedStock(results[0].symbol);
        loadStockData(results[0].symbol);
      } else {
        setSelectedStock(null);
        setChartData([]);
        toast({
          title: "No Results",
          description: "No stocks found matching your query.",
        });
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search for stocks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStocks(false);
    }
  };

  const loadStockData = async (symbol: string) => {
    try {
      setIsLoadingChart(true);
      const data = await getStockData(symbol);
      setChartData(data);
    } catch (error) {
      console.error('Failed to load stock data:', error);
      toast({
        title: "Error",
        description: `Failed to load data for ₹{symbol}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoadingChart(false);
    }
  };

  const handleSelectStock = (symbol: string) => {
    setSelectedStock(symbol);
    loadStockData(symbol);
  };

  const handleStockClick = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      setDetailStock(stock);
      setIsDetailsOpen(true);
    }
  };

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist(prevWatchlist => {
      if (prevWatchlist.includes(symbol)) {
        toast({
          title: "Removed from Watchlist",
          description: `₹{symbol} has been removed from your watchlist.`
        });
        return prevWatchlist.filter(s => s !== symbol);
      } else {
        toast({
          title: "Added to Watchlist",
          description: `₹{symbol} has been added to your watchlist.`
        });
        return [...prevWatchlist, symbol];
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get user info from localStorage
  const userEmail = (() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        return user.email;
      } catch (e) {
        return "User";
      }
    }
    return "User";
  })();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {userEmail}</h1>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {selectedStock && (
            <StockChart 
              data={chartData} 
              symbol={selectedStock} 
              isLoading={isLoadingChart}
            />
          )}
          
          <div>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Stocks</h2>
                <TabsList>
                  <TabsTrigger value="all">All Stocks</TabsTrigger>
                  <TabsTrigger value="watchlist" className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>Watchlist</span>
                    {watchlist.length > 0 && (
                      <span className="ml-1 text-xs bg-primary/20 rounded-full px-1.5 py-0.5">
                        {watchlist.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <StockList 
                  stocks={stocks} 
                  isLoading={isLoadingStocks}
                  onSelectStock={handleStockClick}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                />
              </TabsContent>
              
              <TabsContent value="watchlist" className="mt-0">
                <StockList 
                  stocks={stocks} 
                  isLoading={isLoadingStocks}
                  onSelectStock={handleStockClick}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlistOnly={true}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Stock data provided for demonstration purposes only. Not financial advice.</p>
          <p className="mt-1">© {new Date().getFullYear()} StockTracker</p>
        </div>
      </footer>

      <StockDetails 
        stock={detailStock} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
