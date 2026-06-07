export const findBestTrade = (stockData) => {
    if (!stockData || stockData.length <= 1) return null;

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