const { Ali_Key, Ali_Secret, Ali_DomainName, Ali_RR, Ali_RecordId, DDNS_v6, DDNS_verbose } = process.env;
if (![ Ali_Key, Ali_Secret, Ali_DomainName ].every(Boolean)) {
  console.log('请检查环境变量是否存在: Ali_Key, Ali_Secret, Ali_DomainName');
  process.exit(1);
}
if (![ Ali_RR, Ali_RecordId ].some(Boolean)) {
  console.log('请检查环境变量最少存在一个: Ali_RR, Ali_RecordId');
  process.exit(1);
}
const url = DDNS_v6 ? 'http://ipv6.lookup.test-ipv6.com/ip/' : 'http://ipv4.lookup.test-ipv6.com/ip/';
const Type = DDNS_v6 ? 'AAAA' : 'A';
const timeout = 10000;
const endpoint = 'https://alidns.cn-hangzhou.aliyuncs.com';
const apiVersion = '2015-01-09';
const httpx = require('httpx');
const Core = require('@alicloud/pop-core');
const client = new Core({ accessKeyId: Ali_Key, accessKeySecret: Ali_Secret, endpoint, apiVersion });

let ipRecord = null;
const ipSync = function(ip) {
  if (ipRecord === ip) return;
  console.log(new Date().toISOString() + ':', ip);
  return client.request('DescribeDomainRecords', { DomainName: Ali_DomainName }, { method: 'POST' })
    .then(res => {
      const record = res.DomainRecords.Record.find(e => {
        return e.RR === Ali_RR || e.RecordId === Ali_RecordId;
      });
      if (!record) throw '没有找到记录';
      return record;
    }).then(({ RR, Value, RecordId }) => {
      if (Value === ip) return;
      return client.request('UpdateDomainRecord', { RR, Value: ip, Type, RecordId }, { method: 'POST' });
    }).then(() => ipRecord = ip);
};

let errorTick = 0;
setInterval(() => {
  httpx.request(url)
    .then(res => httpx.read(res))
    .then(res => res.toString())
    .then(res => JSON.parse(res))
    .then(({ ip }) => ipSync(ip))
    .then(() => errorTick > 0 && errorTick--)
    .catch(e => {
      console.log('Error:', e.toString());
      if (++errorTick > 5) process.exit(1);
    });
}, timeout);

process.on('SIGTERM',function(){
  console.log(new Date().toISOString() + ':SIGTERM');
  process.exit(0);
})