import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import stockServices from "../services/stock";

const CACHE_EXPIRY = 60 * 60 * 1000;

export const fetchStockData = createAsyncThunk(
    "stock/fetchStockData",
    async ({ symbol, startDate, endDate }) => {
        const cachedSymbol = JSON.parse(localStorage.getItem("stockSymbol"));
        const cachedData = JSON.parse(localStorage.getItem("stockData"));
        const cacheTimestamp = localStorage.getItem("stockDataTimestamp");

        if (cachedData && cachedSymbol === symbol && Date.now() - cacheTimestamp < CACHE_EXPIRY) {
            console.log("Using cached stock data");
            return cachedData;
        }

        console.log(`Fetching new stock data for ${symbol}`);
        const stockData = await stockServices.getPrices(symbol);

        localStorage.setItem("stockSymbol", JSON.stringify(symbol));
        localStorage.setItem("stockData", JSON.stringify(stockData));
        localStorage.setItem("stockDataTimestamp", Date.now().toString());

        return stockData;
    }
);

const stockSlice = createSlice({
    name: "stock",
    initialState: {
        symbol: "IBM",
        invest: 100,
        stockData: null,
        bestTrade: null,
        startDate: new Date("2024-01-01"),
        endDate: new Date(),
        error: null,
    },
    reducers: {
        setSymbol: (state, action) => {
            state.symbol = action.payload;
        },
        setInvest: (state, action) => {
            state.invest = action.payload;
        },
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockData.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchStockData.fulfilled, (state, action) => {
                const filteredData = action.payload.filter((data) => {
                    const date = new Date(data.date);
                    return date >= state.startDate && date <= state.endDate;
                });

                if (filteredData.length === 0) {
                    state.error = "No stock data available for the selected period.";
                    state.stockData = null;
                    state.bestTrade = null;
                } else {
                    state.stockData = filteredData;
                    state.bestTrade = findBestTrade(filteredData);
                    state.error = null;
                }
            })
            .addCase(fetchStockData.rejected, (state) => {
                state.error = "Failed to fetch stock data. Please try again later.";
            });
    },
});


export const selectStock = (state) => state.stock;


export const { setSymbol, setInvest, setStartDate, setEndDate } = stockSlice.actions;


export default stockSlice.reducer;

const findBestTrade = (stockData) => {
    if (!stockData || stockData.length === 0) return null;

    const reversedData = [...stockData].reverse();
    let minPrice = Number.MAX_VALUE;
    let maxProfit = 0;
    let possBuyDate = null;
    let sellDate = null;
    let buyDate = null;
    let sellPrice = null;
    let buyPrice = null;

    reversedData.forEach((day) => {
        const price = parseFloat(day.open);
        if (price < minPrice) {
            minPrice = price;
            possBuyDate = day.date;
        }

        const profit = price - minPrice;
        if (profit > maxProfit) {
            maxProfit = profit;
            sellDate = day.date;
            buyDate = possBuyDate;
            sellPrice = price;
            buyPrice = minPrice;
        }
    });

    return maxProfit > 0
        ? {
            buyDate,
            sellDate,
            profit: maxProfit.toFixed(2),
            sellPricef: sellPrice.toFixed(2),
            buyPricef: buyPrice.toFixed(2),
        }
        : null;
};