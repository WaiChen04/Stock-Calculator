import { useState } from 'react'
import stockServices from './services/stock.js'
import './App.css'
import StockChart from '../components/StockChart.jsx'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [invest, setInvest] = useState(100);
  const [stock, setStock] = useState(null)
  const [symbol, setSymbol] = useState('IBM')
  const [bestTrade, setBestTrade] = useState(null)
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState(null);

  const CACHE_EXPIRY = 60 * 60 * 1000;

  const handleChange = (event) => {
    setInvest(parseFloat(event.target.value));
  };
  const handleSymbolChange = (event) => {
    setSymbol(event.target.value); 
  };

  const fetchStockDataAndSymbol = async () => {
    const cachedSymbol = JSON.parse(localStorage.getItem("stockSymbol"));
    const cachedData = JSON.parse(localStorage.getItem("stockData"));
    const cacheTimestamp = localStorage.getItem("stockDataTimestamp");


    if (cachedData && cacheTimestamp && (cachedSymbol == symbol) && (Date.now() - cacheTimestamp < CACHE_EXPIRY)) {
      console.log("Using cached stock data");

      const filteredData = cachedData.filter(data => {
        const date = new Date(data.date);
        return date >= startDate && date <= endDate;
      });

      if (filteredData.length === 0) {
        setError("No stock data available for the selected period.");
        setStock(null);
      }
  
        else{
        setError(null);


      setStock(filteredData);
      setSymbol(cachedSymbol);
      const trade = findBestTrade(filteredData)
      setBestTrade(trade)
      }
      return;
    }

    try {
      console.log(symbol)
      const stockSymbol = symbol

      const stockData = await stockServices.getPrices(stockSymbol);

      localStorage.setItem("stockSymbol", JSON.stringify(stockSymbol));
      localStorage.setItem("stockData", JSON.stringify(stockData));
      localStorage.setItem("stockDataTimestamp", Date.now().toString());


      const filteredData = stockData.filter(data => {
        const date = new Date(data.date);
        return date >= startDate && date <= endDate;
      });

      if (filteredData.length === 0) {
        setError("No stock data available for the selected period.");
        setStock(null);
      } 
      
      else {
        setError(null);


      setStock(filteredData)


      const trade = findBestTrade(filteredData)
      setBestTrade(trade)
      }




    } catch (error) {
      console.error('Error fetching stock data:', error)
      setError("Failed to fetch stock data. Please try again later.");
    }
  }

  const findBestTrade = (stockData) => {
    if (!stockData || stockData.length === 0) return null

    const reversedData = [...stockData].reverse();

    let minPrice = Number.MAX_VALUE
    let maxProfit = 0
    let possBuyDate = null
    let sellDate = null
    let buyDate = null
    let sellPrice = null
    let buyPrice = null


    reversedData.forEach((day, index) => {
      const price = parseFloat(day.open)

      if (price < minPrice) {
        minPrice = price
        possBuyDate = day.date
      }

      const profit = price - minPrice

      if (profit > maxProfit) {
        maxProfit = profit
        sellDate = day.date
        buyDate = possBuyDate
        sellPrice = price
        buyPrice = minPrice
      }
    })

    return maxProfit > 0 ? { buyDate, sellDate, profit: maxProfit.toFixed(2), sellPricef: sellPrice.toFixed(2), buyPricef: buyPrice.toFixed(2)  } : null
  }

  return (
    <>
      <h1>Stock Maximum ROI Calculator</h1>


      <div>
        <label>
          Stock Symbol:
          <input
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            placeholder="Enter stock symbol (e.g. AAPL, MSFT)"
          />
        </label>
      </div>

      <div>
      <form>
      <div>
        <label>
          Starting Investment:
          <input
            type="number"
            value={invest}
            onChange={handleChange}
            min="0"
            step="0.01" 
          />
        </label>
      </div>
    </form>


        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </div>
        <div>
        <label>End Date: </label>
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
        </div>

        <div>
      <button onClick={fetchStockDataAndSymbol}>Fetch Data</button>
      </div>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {symbol && (
        <div>
          <h2>{symbol}</h2>
        </div>
      )}

      {bestTrade ? (
        <div>
          <h2>Best Trade Result</h2>
          <p>📅 Buy on: {bestTrade.buyDate} at ${bestTrade.buyPricef}</p>
          <p>📅 Sell on: {bestTrade.sellDate} at ${bestTrade.sellPricef}</p>
          <p>💰 Max Profit: ${bestTrade.profit} for a {(100*bestTrade.sellPricef/bestTrade.buyPricef).toFixed(2)}% ROI</p>
          <p>💰 You would have: ${((bestTrade.sellPricef/bestTrade.buyPricef) * invest).toFixed(2)}</p>
        </div>
      ) : (
        <p>No profitable trade found.</p>
      )}
      
      <div>
       
        {stock ? <StockChart stockData={stock} bestTrade={bestTrade} /> : <p>Loading stock data...</p>}
      </div>

    </>
  )
}

export default App
