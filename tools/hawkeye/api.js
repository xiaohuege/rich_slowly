const axios = require('axios');
const _ = require('underscore');

function catchPromise(promise) {
  return promise
    .then((data) => {
      let tmpData;
      if (_.isUndefined(data) || data === null) {
        tmpData = null;
      } else {
        tmpData = data;
      }
      return [null, tmpData];
    })
    .catch(err => [{ error: err }, {}]);
}

function formatBaseInfo(data) {
  return data.split('~');
}

// time 日期
// open 开盘价
// close 收盘价
// max 最高价
// min 最低价
// count 总手
function formatKline(data) {
  const res = [];
  _.each(data, (item) => {
    res.push({ time: item[0], open: item[1], close: item[2], max: item[3], min: item[4], count: item[5]})
  })
  return res;
}


const exportObj = {
  // 获取基本信息
  // 序号	返回值	含义
  // 1	1	代表交易所，200-美股（us），100-港股（hk），51-深圳（sz），1-上海（sh）
  // 2	贵州茅台	股票名字
  // 3	600519	股票代码
  // 4	2076.91	当前价格
  // 5	2033.00	昨收
  // 6	2000.00	开盘
  // 7	39811	成交量
  // 8	20166	外盘
  // 9	19646	内盘
  // 10	2076.03	买一
  // 11	8	买一量
  // 12	2076.02	买二
  // 13	6	买二量
  // 14	2076.01	买三
  // 15	2	买三量
  // 16	2076.00	买四
  // 17	7	买四量
  // 18	2075.90	买五
  // 19	2	买五量
  // 20	2076.05	卖一
  // 21	3	卖一量
  // 22	2076.82	卖二
  // 23	1	卖二量
  // 24	2076.91	卖三
  // 25	1	买三量
  // 26	2076.97	卖四
  // 27	1	卖四量
  // 28	0	卖五
  // 29	0	卖五量
  // 30	20210305110527	请求时间
  // 31	43.91	涨跌
  // 32	2.16	涨跌%
  // 33	2088.00	最高
  // 34	1988.00	最低
  // 35	2076.91/39811/8132289410	最新价/成交量（手）/成交额（元）
  // 36	39811	成交量
  // 37	813229	成交额
  // 38	0.32	换手率
  // 39	58.53	ttm市盈率
  // 40	-	-
  // 41	2088.00	最高
  // 42	1988.00	最低
  // 43	4.92	振幅
  // 44	26090.10	流通市值
  // 45	26090.10	总市值
  // 46	17.57	lf市净率
  // 47	2236.30	涨停价
  // 48	1829.70	跌停价
  // 49	1.65	量比
  // 50	9	-
  // 51	2042.72	均价
  // 52	57.85	动态市盈率
  // 53	63.32	静态市盈率
  // 54	-	-
  // 55	-	-
  // 56	1.09	-
  // 57	813228.9410	成交额
  async getBaseInfo(code) {
    const [err, res] = await catchPromise(axios.get(`https://qt.gtimg.cn/q=${code}`));
    if (!err && res && res.status == 200) {
      const data = res.data;
      return formatBaseInfo(data);
    }
  },
  async getKLine(code, startDate, endDate, count = 500) {
    const [err, res] = await catchPromise(axios.get(`https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,${startDate},${endDate},${count},qfq`));
    if (!err && res && res.status == 200 && res.data && res.data.code == 0) {
      const data = res.data.data;
      const kline = data[code]['qfqday'];
      return formatKline(kline);
    }
  },
  async getAllStock() {
    const [err, res] = await catchPromise(axios.get('https://api.gugudata.com/stock/cnsymbols?appkey=YOUR_APPKEY&pageindex=YOUR_VALUE&pagesize=YOUR_VALUE'))
    if (!err && res && res.status == 200 && res.data && res.data.DataStatus.StatusCode == 100) {
      return res.data.Data;
    }
  }
};
module.exports = exportObj;