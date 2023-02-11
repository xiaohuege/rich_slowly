const path = require('path');
const fs = require('fs');
const dateUtil = require('../tools/utils/date');
const fileUtil = require('../tools/utils/file');

const context = __dirname;
const extName = '.json';

const outputPath = path.resolve(__dirname, 'index.js');

const dates = fs.readdirSync(context).filter((item) => path.extname(item) == extName).map((item) => +new Date(item.replace(extName, '')));
const lastDate = Math.max(...dates);
const filepath = path.resolve(context, dateUtil.formatDate(new Date(lastDate)) + extName);
const content = 'var data = ' + fileUtil.readFile(filepath);
fileUtil.writeFile(outputPath, content);
