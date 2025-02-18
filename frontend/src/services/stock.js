import axios from 'axios'

const apiKey = import.meta.env.VITE_apiKey;
console.log(apiKey)



const getPrices = async (symbol) => {
  if (!symbol) {
    console.error('Stock symbol is null.');
    return [];
  }
  try {

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`
    const response = await axios.get(url) 
    console.log('You are making an API call to:', url)
    const timeSeries = response.data['Time Series (Daily)']
    
 
   

    if (!timeSeries) {
      throw new Error('Time Series data not found')
    }


    const prices = Object.entries(timeSeries).map(([date, data]) => ({
      date,
      open: data['1. open']
    }))
    
    return prices
  } catch (error) {
    console.error('Error fetching stock prices:', error)
    return []
  }
}


  export default { getPrices }
  