import { describe, it, expect } from "vitest";
import { findBestTrade } from "./findBestTrade.js";

describe("findBestTrade", () => {
    it("finds maximum profit of 5", () => {
        const stockData = [
            { date: "2026-01-06", open: "4" },
            { date: "2026-01-05", open: "6" },
            { date: "2026-01-04", open: "3" },
            { date: "2026-01-03", open: "5" },
            { date: "2026-01-02", open: "1" },
            { date: "2026-01-01", open: "7" },
        ];

        const result = findBestTrade(stockData);

        expect(result).not.toBeNull();
        expect(result.profit).toBe("5.00");
        expect(result.buyPricef).toBe("1.00");
        expect(result.sellPricef).toBe("6.00");
        expect(result.buyDate).toBe("2026-01-02");
        expect(result.sellDate).toBe("2026-01-05");
    });

    it("returns null when no profit is possible", () => {
        const stockData = [
            { date: "2026-01-05", open: "1" },
            { date: "2026-01-04", open: "3" },
            { date: "2026-01-03", open: "4" },
            { date: "2026-01-02", open: "6" },
            { date: "2026-01-01", open: "7" },
        ];

        const result = findBestTrade(stockData);

        expect(result).toBeNull();
    });

    it("returns null for empty array", () => {
        expect(findBestTrade([])).toBeNull();
    });

    it("returns null for null input", () => {
        expect(findBestTrade(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
        expect(findBestTrade(undefined)).toBeNull();
    });

    it("returns null for a single day of data", () => {
        const stockData = [
            { date: "2026-01-01", open: "10" }
        ];

        expect(findBestTrade(stockData)).toBeNull();
    });

    it("handles decimal prices correctly", () => {
        const stockData = [
            { date: "2026-01-03", open: "15.75" },
            { date: "2026-01-02", open: "12.50" },
            { date: "2026-01-01", open: "10.25" },
        ];

        const result = findBestTrade(stockData);

        expect(result).not.toBeNull();
        expect(result.profit).toBe("5.50");
        expect(result.buyPricef).toBe("10.25");
        expect(result.sellPricef).toBe("15.75");
    });

    it("returns the best trade when multiple profitable trades exist", () => {
        const stockData = [
            { date: "2026-01-06", open: "7" },
            { date: "2026-01-05", open: "10" },
            { date: "2026-01-04", open: "2" },
            { date: "2026-01-03", open: "8" },
            { date: "2026-01-02", open: "1" },
            { date: "2026-01-01", open: "5" },
        ];

        const result = findBestTrade(stockData);

        expect(result).not.toBeNull();
        expect(result.profit).toBe("9.00");
        expect(result.buyPricef).toBe("1.00");
        expect(result.sellPricef).toBe("10.00");
    });
});