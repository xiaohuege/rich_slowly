const api = require('./api')
const fileUtil = require('../utils/file');
const path = require('path');
const _ = require('underscore');

function getPrefix(code) {
  const str = code.slice(0, 3);
  let prefix = '';
  let position = '';
  switch(str) {
    case '300':
      prefix = 'sz';
      position = '创业板';
      break;
    case '600':
    case '601':
    case '603':
    case '605':
      prefix = 'sh';
      position = '沪市主板';
      break;
    case '000':
      prefix = 'sz';
      position = '深市主板';
      break;
    case '588':
      prefix = 'sh';
      position = '科创板';
      break;
  }
  return [prefix, position];
}

async function getValidStocks(stocks) {
  
}

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
    const [prefix, position] = getPrefix(code);
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