import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import stockService from "./stock";

vi.mock("axios");

describe("Stock Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("import", {
      meta: {
        env: {
          VITE_apiKey: "test-api-key",
        },
      },
    });
  });

  it("fetches and transforms stock prices correctly", async () => {
    const mockData = {
      data: {
        "Time Series (Daily)": {
          "2026-06-04": { "1. open": "150.25" },
          "2026-06-03": { "1. open": "149.80" },
          "2026-06-02": { "1. open": "151.00" },
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockData);

    const result = await stockService.getPrices("AAPL");

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ date: "2026-06-04", open: "150.25" });
    expect(result[1]).toEqual({ date: "2026-06-03", open: "149.80" });
    expect(result[2]).toEqual({ date: "2026-06-02", open: "151.00" });
  });

  it("returns empty array when symbol is null", async () => {
    const result = await stockService.getPrices(null);
    expect(result).toEqual([]);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("returns empty array when symbol is undefined", async () => {
    const result = await stockService.getPrices(undefined);
    expect(result).toEqual([]);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("returns empty array when Time Series data is not found", async () => {
    const mockData = {
      data: {
        "Error Message": "Invalid API call",
      },
    };

    axios.get.mockResolvedValueOnce(mockData);

    const result = await stockService.getPrices("INVALID");

    expect(result).toEqual([]);
  });

  it("returns empty array on network error", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const result = await stockService.getPrices("AAPL");

    expect(result).toEqual([]);
  });

  it("constructs correct API URL", async () => {
    const mockData = {
      data: {
        "Time Series (Daily)": {
          "2026-06-04": { "1. open": "150.25" },
        },
      },
    };

    axios.get.mockResolvedValueOnce(mockData);

    await stockService.getPrices("TSLA");

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("TSLA")
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining("TIME_SERIES_DAILY")
    );
  });

  it("handles large datasets", async () => {
    const largeDataset = {};
    for (let i = 0; i < 100; i++) {
      const date = new Date(2026, 5, 4 - i).toISOString().split("T")[0];
      largeDataset[date] = { "1. open": (150 + Math.random() * 10).toString() };
    }

    const mockData = {
      data: {
        "Time Series (Daily)": largeDataset,
      },
    };

    axios.get.mockResolvedValueOnce(mockData);

    const result = await stockService.getPrices("AAPL");

    expect(result).toHaveLength(100);
  });
});
