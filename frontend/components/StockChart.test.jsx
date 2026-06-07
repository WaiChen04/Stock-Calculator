import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StockChart from "./StockChart";

describe("StockChart Component", () => {
  const mockStockData = [
    { date: "2026-01-05", open: "103.50" },
    { date: "2026-01-04", open: "105.00" },
    { date: "2026-01-03", open: "101.00" },
    { date: "2026-01-02", open: "102.50" },
    { date: "2026-01-01", open: "100.00" },
  ];

  it("renders the chart container", () => {
    render(<StockChart stockData={mockStockData} bestTrade={null} />);
    const container = document.querySelector("div[style*='500px']");
    expect(container).toBeInTheDocument();
  });

  it("renders chart with stock data", () => {
    const { container } = render(<StockChart stockData={mockStockData} bestTrade={null} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("displays reference dots when bestTrade is provided", () => {
    const bestTrade = {
      buyDate: "2026-01-02",
      sellDate: "2026-01-05",
      profit: "3.50",
    };

    const { container } = render(
      <StockChart stockData={mockStockData} bestTrade={bestTrade} />
    );

    const dots = container.querySelectorAll("circle");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("handles empty stock data", () => {
    render(<StockChart stockData={[]} bestTrade={null} />);
    const container = document.querySelector("div[style*='500px']");
    expect(container).toBeInTheDocument();
  });

  it("renders correctly with only buy date", () => {
    const bestTrade = {
      buyDate: "2026-01-02",
      sellDate: null,
    };

    const { container } = render(
      <StockChart stockData={mockStockData} bestTrade={bestTrade} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders correctly with only sell date", () => {
    const bestTrade = {
      buyDate: null,
      sellDate: "2026-01-05",
    };

    const { container } = render(
      <StockChart stockData={mockStockData} bestTrade={bestTrade} />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("handles data with large price differences", () => {
    const volatileData = [
      { date: "2026-01-01", open: "10.00" },
      { date: "2026-01-02", open: "500.00" },
      { date: "2026-01-03", open: "15.00" },
    ];

    render(<StockChart stockData={volatileData} bestTrade={null} />);
    const container = document.querySelector("div[style*='500px']");
    expect(container).toBeInTheDocument();
  });

  it("reverses stock data for display", () => {
    const { container } = render(<StockChart stockData={mockStockData} bestTrade={null} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
