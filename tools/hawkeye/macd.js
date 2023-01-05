const _ = require('underscore');

function calcEMA(data, term, targetKey, valueKey) {
  _.each(data, (item, idx) => {
    if (idx == 0) {
      item[targetKey] = item[valueKey];
    } else {
      item[targetKey] = ((term - 1) * data[idx - 1][targetKey] + 2 * item[valueKey]) / (term + 1);
    }
  })
}

function calcDIF(data) {
  _.each(data, (item) => {
    item['DIF'] = item['EMA_short'] - item['EMA_long'];
  })
}


module.exports = function calcMacd(data, shortTerm = 12, longTerm = 26, difTerm = 9) {
  // 计算EMA
  calcEMA(data, shortTerm, 'EMA_short', 'close');
  calcEMA(data, longTerm, 'EMA_long', 'close');
  // 计算DIF
  calcDIF(data);
  // 计算离差值
  calcEMA(data, difTerm, 'DEA', 'DIF');
  // 计算macd
  _.each(data, (item) => {
    item['MACD'] = 2 * (item['DIF'] - item['DEA'])
  })
  return data;
}