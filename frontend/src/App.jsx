import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchStockData, setSymbol, setInvest, setStartDate, setEndDate, selectStock } from "./reducers/stockReducer.js";
import StockChart from "../components/StockChart";
import DatePicker from "react-datepicker";
import './App.css'
import "react-datepicker/dist/react-datepicker.css";
import { Form, Button } from "react-bootstrap";
import dayjs from "dayjs";

function App() {
  const dispatch = useDispatch();
  const { symbol, invest, stockData, bestTrade, startDate, endDate, error } = useSelector(selectStock);
  const [localSymbol, setLocalSymbol] = useState(symbol);
  const [localInvest, setLocalInvest] = useState(invest);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [animate, setAnimate] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setAnimate(false);

    setTimeout(() => {
      setAnimate(true);
    }, 500);

    dispatch(setSymbol(localSymbol));
    dispatch(setInvest(localInvest));
    dispatch(setStartDate(localStartDate));
    dispatch(setEndDate(localEndDate));
    dispatch(fetchStockData({ symbol: localSymbol, startDate: localStartDate, endDate: localEndDate }));

  };

  return (
    <>
      <h1>Maximum ROI Calculator for Stocks</h1>
      <p>Enter a stock symbol, a starting investment, and a time frame
        to find the best singular trade to maximize your return on investment.</p>
      <p>Assumes you start out with no stock and can only make one purchase and one sale</p>
      <p>Stock data is from Alpha Vantage API and only fetched the daily opening prices.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="form">
          <Form.Label>Stock Symbol:</Form.Label>
          <Form.Control
            type="text"
            value={localSymbol}
            onChange={(e) => setLocalSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g. AAPL, MSFT)"
          />
        </Form.Group>

        <Form.Group className="form">
          <Form.Label>Starting Investment:</Form.Label>
          <Form.Control
            type="number"
            value={localInvest}
            onChange={(e) => setLocalInvest(parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />

        </Form.Group>

        <Form.Group>
          <Form.Label>Start Date:</Form.Label>
          <DatePicker selected={localStartDate} onChange={(date) => setLocalStartDate(date)} className="form-control" />
        </Form.Group>

        <Form.Group>
          <Form.Label>End Date:</Form.Label>
          <DatePicker selected={localEndDate} onChange={(date) => setLocalEndDate(date)} className="form-control" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Fetch Data
        </Button>
      </Form>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {symbol && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2>Stock Symbol: {symbol}</h2>
        </motion.div>
      )}

      {bestTrade ? (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={animate ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p>🔴If you had bought ${invest} worth of {symbol} stock on {dayjs(bestTrade.buyDate).format("MMMM D, YYYY")} at ${bestTrade.buyPricef} per stock</p>
          <p>🟢 And sold on {dayjs(bestTrade.sellDate).format("MMMM D, YYYY")} at ${bestTrade.sellPricef} per stock</p>
          <p>💰 You would have: ${((bestTrade.sellPricef / bestTrade.buyPricef) * invest).toFixed(2)} for a {(100 * bestTrade.sellPricef / bestTrade.buyPricef).toFixed(2)}% ROI</p>
        </motion.div>
      ) : (
        <p>No profitable trade found.</p>
      )}

      <div>

        {stockData ?
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={animate ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <StockChart stockData={stockData} bestTrade={bestTrade} />
          </motion.div> : <p>Waiting for fetched stock data</p>}
      </div>
    </>
  );
}

export default App;
