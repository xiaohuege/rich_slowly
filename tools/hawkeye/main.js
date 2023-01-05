const api = require('./api');
const calcMacd = require('./macd');

const code = 'sz002008'

async function bootstrap() {
  // const baseInfo = await api.getBaseInfo(code);
  // console.log(111, baseInfo[52], baseInfo[53])
  const kline = await api.getKLine(code, '2022-10-1', '2022-12-31');
  const macd = calcMacd(kline);
  console.log(111, macd)
}

bootstrap();

