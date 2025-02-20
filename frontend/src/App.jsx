import { useState } from 'react'
import stockServices from './services/stock.js'
import './App.css'
import StockChart from '../components/StockChart.jsx'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { Form, Button } from 'react-bootstrap'



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

  const getCachedData = (symbol) => {
    const cachedSymbol = JSON.parse(localStorage.getItem("stockSymbol"));
    const cachedData = JSON.parse(localStorage.getItem("stockData"));
    const cacheTimestamp = localStorage.getItem("stockDataTimestamp");
    if (cachedData && cachedSymbol === symbol && Date.now() - cacheTimestamp < CACHE_EXPIRY) {
      console.log("Using cached stock data");
      return cachedData;
    }
    return null;
  };

  const setCachedData = (symbol, stockData) => {
    localStorage.setItem("stockSymbol", JSON.stringify(symbol));
    localStorage.setItem("stockData", JSON.stringify(stockData));
    localStorage.setItem("stockDataTimestamp", Date.now().toString());
  };

  const fetchStockDataAndSymbol = async () => {
    try {
      event.preventDefault();
      let stockData = getCachedData(symbol);

      if (!stockData) {
        console.log(`Fetching new stock data for ${symbol}`);
        stockData = await stockServices.getPrices(symbol);
        setCachedData(symbol, stockData);
      }

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

    return maxProfit > 0 ? { buyDate, sellDate, profit: maxProfit.toFixed(2), sellPricef: sellPrice.toFixed(2), buyPricef: buyPrice.toFixed(2) } : null
  }

  return (
    <>
      <h1>Stock Maximum ROI Calculator</h1>
      <p>Enter a stock symbol, a starting investment, and a time frame to find the best singular trade to maximize your return on investment.</p>
      <p>Stock data is fetched from Alpha Vantage API and only takes the daily opening prices.</p>
      <Form onSubmit={fetchStockDataAndSymbol}>

        <Form.Group className='form'>
          <Form.Label>Stock Symbol:</Form.Label>
          <Form.Control
            type="text"
            value={symbol}
            onChange={handleSymbolChange}
            placeholder="Enter stock symbol (e.g. AAPL, MSFT)"
          />
        </Form.Group>

        <Form.Group className='form'>
          <Form.Label>Starting Investment:</Form.Label>
          <Form.Control
            type="number"
            value={invest}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Start Date:</Form.Label>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)}
            className="form-control" />
        </Form.Group>


        <Form.Group>
          <Form.Label>End Date:</Form.Label>
          <DatePicker selected={endDate} onChange={date => setEndDate(date)}
            className="form-control" />
        </Form.Group>


        <Button variant="primary" type="submit">
          Fetch Data
        </Button>


      </Form>


      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {stock && (
        <div>
          <h2>Stock Symbol: {symbol}</h2>
        </div>
      )}

      {bestTrade ? (
        <div>
          <p>🔴If you had bought ${invest} worth of {symbol} stock on {dayjs(bestTrade.buyDate).format("MMMM D, YYYY")} at ${bestTrade.buyPricef} per stock</p>
          <p>🟢 And sold on {dayjs(bestTrade.sellDate).format("MMMM D, YYYY")} at ${bestTrade.sellPricef} per stock</p>
          <p>💰 You would have: ${((bestTrade.sellPricef / bestTrade.buyPricef) * invest).toFixed(2)} for a {(100 * bestTrade.sellPricef / bestTrade.buyPricef).toFixed(2)}% ROI</p>
        </div>
      ) : (
        <p>No profitable trade found.</p>
      )}

      <div>

        {stock ? <StockChart stockData={stock} bestTrade={bestTrade} /> : <p>Waiting for fetched stock data</p>}
      </div>

    </>
  )
}

export default App
