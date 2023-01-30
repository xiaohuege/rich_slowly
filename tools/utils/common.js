module.exports = {
  getStockPrefix(code) {
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
}