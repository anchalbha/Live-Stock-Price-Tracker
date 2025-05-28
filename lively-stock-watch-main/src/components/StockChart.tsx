
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  symbol: string;
  isLoading?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol, isLoading = false }) => {
  const isPriceUp = data.length > 1 && data[data.length - 1].value > data[0].value;
  
  if (isLoading) {
    return (
      <Card className="w-full h-[400px] animate-pulse-slow">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Loading chart...</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] bg-muted/30 rounded flex items-center justify-center">
          <div className="text-muted-foreground">Fetching data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{symbol} Price History</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(tick) => {
                return tick.substring(5);
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={['dataMin', 'dataMax']}
              tickFormatter={(tick) => `$${tick.toFixed(2)}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPriceUp ? 'hsl(var(--positive))' : 'hsl(var(--negative))'}
              strokeWidth={2}
              dot={false}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StockChart;
