import { describe, it, expect } from "vitest";
import stockReducer, {
  setSymbol,
  setInvest,
  setStartDate,
  setEndDate,
  selectStock,
} from "./stockReducer";

describe("Stock Reducer", () => {

const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
const defaultStartDate = ninetyDaysAgo;

  const initialState = {
    symbol: "IBM",
    invest: 100,
    stockData: null,
    bestTrade: null,
    startDate: defaultStartDate,
    endDate: new Date(),
    error: null,
  };

  it("returns initial state", () => {
    const state = stockReducer(undefined, { type: "UNKNOWN" });
    expect(state.symbol).toBe("IBM");
expect(state.invest).toBe(100);
expect(state.stockData).toBeNull();
expect(state.bestTrade).toBeNull();
expect(state.error).toBeNull();
  });

  it("handles setSymbol action", () => {
    const action = setSymbol("AAPL");
    const state = stockReducer(initialState, action);
    expect(state.symbol).toBe("AAPL");
  });

  it("handles setInvest action", () => {
    const action = setInvest(5000);
    const state = stockReducer(initialState, action);
    expect(state.invest).toBe(5000);
  });

  it("handles setStartDate action", () => {
    const date = new Date("2026-01-01");
    const action = setStartDate(date);
    const state = stockReducer(initialState, action);
    expect(state.startDate).toBe(date);
  });

  it("handles setEndDate action", () => {
    const date = new Date("2026-06-04");
    const action = setEndDate(date);
    const state = stockReducer(initialState, action);
    expect(state.endDate).toBe(date);
  });

  it("selects stock state correctly", () => {
    const testState = {
      stock: {
        symbol: "MSFT",
        invest: 1000,
        stockData: [],
        bestTrade: null,
        startDate: null,
        endDate: null,
        error: null,
        loading: false,
      },
    };

    const selected = selectStock(testState);
    expect(selected.symbol).toBe("MSFT");
    expect(selected.invest).toBe(1000);
  });

  it("maintains previous state when action type is unknown", () => {
    const currentState = { ...initialState, symbol: "GOOGL" };
    const state = stockReducer(currentState, { type: "UNKNOWN" });
    expect(state.symbol).toBe("GOOGL");
  });

  it("handles multiple sequential actions", () => {
    let state = initialState;
    state = stockReducer(state, setSymbol("TSLA"));
    state = stockReducer(state, setInvest(2000));
    state = stockReducer(state, setStartDate(new Date("2026-01-01")));

    expect(state.symbol).toBe("TSLA");
    expect(state.invest).toBe(2000);
    expect(state.startDate).toEqual(new Date("2026-01-01"));
  });
});
