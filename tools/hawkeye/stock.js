const api = require('./api')
const fileUtil = require('../utils/file');
const path = require('path');
const stockUtil = require('../utils/common');

async function bootstrap() {
  // const stocks = await api.getAllStock();
  const filePath = path.resolve(__dirname, '../../data/all.json');
  // fileUtil.writeFile(filePath, JSON.stringify(stocks, null, 2));
  // 筛选合适的标的，规则：PE < 50 && price < 100
  const stocks = JSON.parse(fileUtil.readFile(filePath));
  const stockPath = path.resolve(__dirname, '../../data/stock.json');
  const validStocks = []
  let idx = 0;
  console.log(`总数：${stocks.length}`);
  while(idx < stocks.length) {
    const { Symbol: code, StockName } = stocks[idx];
    const [prefix, position] = stockUtil.getStockPrefix(code);
    if (prefix) {
      const baseInfo = await api.getBaseInfo(`${prefix}${code}`);
      if (baseInfo) {
        const pe = baseInfo[52];
        const price = baseInfo[4];
        console.log('基础信息' + (idx + 1), code, StockName, prefix, position, pe, price)
        if (pe > 0 && pe < 50 && price < 100) {
          validStocks.push({ code, name: StockName });
        }
      }
    }
    idx += 1;
  }
  fileUtil.writeFile(stockPath, JSON.stringify(validStocks, null, 2));
}

bootstrap();