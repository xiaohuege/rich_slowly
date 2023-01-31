# 定期发现符合的标的，并记录整个执行过程

## 目录说明
```
app 启动web服务，方便查看数据
tools 寻找标的和生成数据的工具
data 输入的原始数据
roadmap 记录执行过程和结果
```

## 获取标的数据
```
资料：
https://blog.csdn.net/geofferysun/article/details/114386084
https://blog.csdn.net/geofferysun/article/details/114640013

```
### 1、获取实时数据
https://qt.gtimg.cn/q=sh600519

### 2、获取k线数据2
https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=sh600519,day,2020-3-1,2021-3-1,500,qfq
参数说明：param=代码,日k，开始日期，结束日期，获取多少个交易日，前复权
结果说明：交易日-开盘价-收盘价-最高价-最低价-总手

### 3、获取k线数据2
https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?_var=kline_dayhfq&param=sh600519,day,,,320,hfq&r=0.9860043111257255

### 4、获取实时资金流向
http://qt.gtimg.cn/q=ff_sh600519

### 5、雪球地址
https://xueqiu.com/S/SZ002008