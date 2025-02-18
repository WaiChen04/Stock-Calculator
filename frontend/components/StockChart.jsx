import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot
} from "recharts";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const date = dayjs(payload[0].payload.date).format("MMMM D, YYYY");

    return (
      <div>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Open Price:</strong> ${parseFloat(payload[0].value).toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const StockChart = ({ stockData, bestTrade }) => {

  const reversedData = [...stockData].reverse();

  const maxOpenPrice = Math.max(...reversedData.map(d => parseFloat(d.open)));
  const minOpenPrice = Math.min(...reversedData.map(d => parseFloat(d.open)));

  return (
    <div style={{ width: '100%', height: '500px' }}> 
      <ResponsiveContainer width="90%" height="100%"> 
      <LineChart data={reversedData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date"  />
        <YAxis   domain={[Math.max((minOpenPrice- 10),0), maxOpenPrice + 10]} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="open" stroke="#A020F0" strokeWidth={2} dot={false} />

        {bestTrade?.buyDate && (
          <ReferenceDot 
            x={bestTrade.buyDate} 
            y={reversedData.find(d => d.date === bestTrade.buyDate)?.open} 
            fill="red" 
            r={6} 
          />
        )}

        {bestTrade?.sellDate && (
          <ReferenceDot 
            x={bestTrade.sellDate} 
            y={reversedData.find(d => d.date === bestTrade.sellDate)?.open} 
            fill="green" 
            r={6} 
          />
        )}
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
