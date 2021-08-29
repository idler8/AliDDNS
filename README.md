# 阿里云DDNS
自动调整阿里云DNS解析记录为本机外网地址

## 使用说明
1. 安装插件`yarn install`或者`npm install`
2. 配置环境变量
```sh
# 以下三项必须配置
export Ali_Key=你的阿里云Key
export Ali_Secret=你的阿里云ID的Secret
export Ali_DomainName=该Key可控制的你的域名
# 以下两项选用一个，一般使用Ali_RR
export Ali_RR=需要控制的解析记录的主机记录(域名前缀)
export Ali_RecordId=需要控制的解析记录的唯一ID
# 以下配置按需设定
export DDNS_v6=配置此项则启用IPV6检查
```
3. 运行脚本
```sh
# 前台运行
node index.js &
# 后台运行
nohup node index.js &
```
