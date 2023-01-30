module.exports = {
  formatDate(date, fmt = 'yyyy-MM-dd') {
    const weekMap = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' };
    const day = date.getDay();
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'H+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    if (/(w+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, weekMap[day]);
    if (/(W+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, day === 0 || day === 6 ? `(${weekMap[day]})` : '');
    for (const k in o) {
      if (new RegExp(`(${  k  })`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr((`${o[k]}`).length));
      }
    }
    return fmt;
  },
  getLastDayByStep(date, step = 1) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - step);
  }
}