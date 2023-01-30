const path = require('path');
const api = require('./api');
const calcMacd = require('./macd');
const dateUtil = require('../utils/date');
const fileUtil = require('../utils/file');
const stockUtil = require('../utils/common');
const _ = require('underscore');

const DAY_COUNT = 60;

const context = path.resolve(__dirname, "../../data/");

function getData(fileName) {
  const fullpath = path.resolve(context, `${fileName}.json`);
  const content = fileUtil.readFile(fullpath);
  return JSON.parse(content);
}

function getKLine(code, startDate, endDate) {
  const fullpath = path.resolve(__dirname, `../../cache/${code.slice(2)}.json`);
  const content = fileUtil.readFile(fullpath);
  if (!content) return;
  return JSON.parse(content);
}

function writeKline(code, data) {
  const fullpath = path.resolve(__dirname, `../../cache/${code}.json`);
  fileUtil.writeFile(fullpath, JSON.stringify(data, null, 2));
}

// 最近5天 DIF < 0 & DEA < 0，且MACD绝对值大于平均值
function checkDownZero(fastLines, slowLines, avgMACD) {
  const arr = [...fastLines.slice(-5), ...slowLines.slice(-5)];
  for (let i of arr) {
    if (i[1] > 0) return false;
    if (Math.abs(i[2]) < avgMACD) return false;
  }
  return true;
}


async function bootstrap() {
  // const baseInfo = await api.getBaseInfo('sz002008');
  // console.log(111, baseInfo[52], baseInfo[53])
  // const kline = await api.getKLine('sz002008', '2022-10-1', '2022-12-31');
  // const macd = calcMacd(kline);
  // console.log(111, macd)
  const endDate = new Date();
  const endDateStr = dateUtil.formatDate(endDate);
  const startDate = dateUtil.getLastDayByStep(endDate, DAY_COUNT);
  const startDateStr = dateUtil.formatDate(startDate);
  const stocks = getData('stock');
  const validStocks = [];
  let idx = -1;
  console.log(`总数：${stocks.length}`);
  while(true) {
    idx++;
    if (idx > stocks.length - 1) break;
    const { code, name } = stocks[idx];
    // if (idx > 50) return;
    if (name.includes('N')) continue;
    const [prefix] = stockUtil.getStockPrefix(code);
    if (!prefix) continue;
    const kline = await getKLine(`${prefix}${code}`, startDateStr , endDateStr);
    if (!kline) continue;
    const macd = calcMacd(kline);
    if (!macd || macd.length < 15) continue;
    const fastLines = [];
    const slowLines = [];
    let totalMACD = 0;
    _.each(macd, ({ time, DIF, DEA, MACD }) => {
      fastLines.push([time, DIF, MACD]);
      slowLines.push([time, DEA, MACD]);
      totalMACD += Math.abs(MACD);
    });
    // MACD 均值
    const avgMACD = totalMACD/macd.length;
    // 最近5条数据都在0轴一下
    if (!checkDownZero(fastLines, slowLines, avgMACD)) continue;
    // 判断是否下降趋势结束--金叉
    // 1、按日期查找所有的上穿交叉点
    const intersections = [];
    for (let i = 1, total = macd.length; i < total; i++) {
      const f1 = macd[i-1].DIF;
      const s1 = macd[i-1].DEA;
      const f2 = macd[i].DIF;
      const s2 = macd[i].DEA;
      if (f2 >= f1 && s2 <= s1) {
        // 存在上穿交叉点
        // 判断交叉点离哪个点更近--差值越小就离谁越近
        if (Math.abs(f1 - s1) > Math.abs(f2 - s2)) {
          intersections.push([i, macd[i].time, macd[i].MACD]);
        } else {
          intersections.push([i-1, macd[i-1].time, macd[i-1].MACD]);
        }
      }
    }
    const last = intersections[intersections.length - 1];
    if (!last) continue;
    validStocks.push({ code, name, prefix, date: last[1], macd: last[2] });
  }
  validStocks.sort((a, b) => Math.abs(b.macd) - Math.abs(a.macd));
  console.log(validStocks);
  fileUtil.writeFile(path.resolve(__dirname, `../../record/${endDateStr}.json`), JSON.stringify(validStocks, null, 2));
}

bootstrap();

