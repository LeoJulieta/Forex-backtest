
function runBacktest() {
  const fileInput = document.getElementById('fileInput');
  const result = document.getElementById('result');

  if (!fileInput.files.length) {
    result.textContent = 'Por favor selecciona un archivo CSV.';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    const lines = text.trim().split('\n');
    const prices = lines.slice(1).map(line => {
      const parts = line.split(',');
      return {
        time: parts[0],
        close: parseFloat(parts[4])
      };
    });

    let wins = 0, losses = 0;
    for (let i = 50; i < prices.length - 3; i++) {
      const ma50 = prices.slice(i - 50, i).reduce((sum, p) => sum + p.close, 0) / 50;
      const belowMA = prices.slice(i, i + 3).every(p => p.close < ma50);
      const threeGreen = prices[i].close < prices[i+1].close && prices[i+1].close < prices[i+2].close;

      if (belowMA && threeGreen) {
        if (prices[i+3].close < prices[i+2].close) wins++;
        else losses++;
      }
    }

    result.textContent = `Backtest terminado.\nGanadas: ${wins}\nPerdidas: ${losses}`;
  };
  reader.readAsText(fileInput.files[0]);
}
