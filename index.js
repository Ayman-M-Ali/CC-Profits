// A function to update the DOM element with the given id and price
const currencies = [
  { type: 'BTC', number: 0.01, average: 41554.2817 },
  { type: 'MATIC', number: 1323.40, average: 1.05645 },
  { type: 'DOT', number: 43.65, average: 14.4648 },
  { type: 'FTM', number: 680.70, average: 0.8584 },
  { type: 'VET', number: 902.63, average: 0.0853 },
  { type: 'SOL', number: 2, average: 171.23 },
  { type: 'KDA', number: 91.75, average: 5.774 },
  { type: 'DOGE', number: 3176, average: 0.1646 },
  { type: 'SHIB', number: 6388913, average: 0.000031497 },
  { type: 'SAND', number: 20, average: 4.2407 },
  { type: 'XRP', number: 147.12, average: 0.7794 },
  { type: 'ONE', number: 495, average: 0.265 },
  { type: 'HOT', number: 20000, average: 0.0081 },
  { type: 'ADA', number: 35.03, average: 1.2 }
];

// Function to create a table row with currency data
function createTableRow(currency, currentPrice) {
  const previousPriceCost = currency.number * currency.average;
  const currentPriceCost = currency.number * currentPrice;
  const profit = currentPriceCost - previousPriceCost;
  return `<tr>
            <td>${currency.type}</td>
            <td>${currency.number.toLocaleString()}</td>
            <td>${Number(String(currency.average)[0]) > 0 ? currency.average.toLocaleString('en-US', { minimumFractionDigits: 2 }) : currency.average.toLocaleString('en-US', { minimumFractionDigits: 5 })}</td>
            <td>${previousPriceCost.toLocaleString()}</td>
            <td>${Number(String(currentPrice)[0]) > 0 ? currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }) : currentPrice.toLocaleString('en-US', { minimumFractionDigits: 5 })}</td>
            <td>${currentPriceCost.toLocaleString()}</td>
            <td class= "profit">${profit.toLocaleString()}</td>
          </tr>`;
}

// Function to update the table with new data
function updateTable(data) {
  const table = document.getElementById('crypto-table');
  table.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Type of Currency</th>
          <th>Number of Currency</th>
          <th>Average</th>
          <th>Previous Price Cost</th>
          <th>Current Price</th>
          <th>Current Price Cost</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(currency => createTableRow(currency, currency.currentPrice)).join('')}
      </tbody>
    </table>
  `;

    const profitColors = document.querySelectorAll('.profit');

    profitColors.forEach(profitColor => {
      const value = parseFloat(profitColor.textContent);

      return value > 0 ? profitColor.style = 'background: #0ECB81; color: #000' : profitColor.style = 'background: #F6465D; color: #000'
    });
}

// The main function to fetch and display cryptocurrency prices
function getCryptoPrices() {
  const urls = currencies.map(currency => `https://api.binance.com/api/v3/ticker/price?symbol=${currency.type}USDT`);

  // Fetch prices for all cryptocurrencies
  Promise.all(urls.map(url => fetch(url)))
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(prices => {
      // Update the DOM with formatted prices
      const updatedCurrencies = currencies.map((currency, index) => {
        currency.currentPrice = parseFloat(prices[index].price);
        return currency;
      });
      updateTable(updatedCurrencies);
    })
    .catch(error => {
      console.error('Error fetching cryptocurrency prices:', error);
    });
}

// Initialize the price fetching when the window loads
window.onload = getCryptoPrices;

// Update the table every 5 seconds
setInterval(getCryptoPrices, 3000);
