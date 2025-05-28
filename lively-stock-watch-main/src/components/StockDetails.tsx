import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Stock } from "./StockList";
import { Info } from "lucide-react";

interface StockDetailsProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
}

const USD_TO_INR_RATE = 83.5;

const StockDetails = ({ stock, isOpen, onClose }: StockDetailsProps) => {
  if (!stock) return null;

  const priceInINR = stock.price * USD_TO_INR_RATE;
  const changeInINR = stock.change * USD_TO_INR_RATE;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="h-5 w-5" />
            {stock.symbol} - {stock.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detailed stock information (in INR)
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Current Price</h4>
              <p className="text-lg font-bold">₹{priceInINR.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">₹{stock.price.toFixed(2)} INR</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Change</h4>
              <p className={`text-lg font-bold ₹{stock.change >= 0 ? 'stock-up' : 'stock-down'}`}>
                {stock.change >= 0 ? '+' : ''}₹{Math.abs(changeInINR).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </p>
              <p className="text-xs text-muted-foreground">
                {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} INR
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance</h4>
            <div className="bg-muted h-8 rounded-md flex items-center">
              <div
                className={`h-full rounded-md ${stock.changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(stock.changePercent * 5), 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Trading Volume</h4>
              <p className="text-lg">123,456</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Market Cap</h4>
              <p className="text-lg">₹{(45.6 * USD_TO_INR_RATE).toFixed(1)}B</p>
              <p className="text-xs text-muted-foreground">$45.6B USD</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockDetails;
