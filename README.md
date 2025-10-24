# PMail 修改版{UI}

PMail是一个追求极简部署流程、极致资源占用的个人域名邮箱服务器。单文件运行，包含完整的收发邮件服务和Web端邮件管理功能。只需一台服务器、一个域名、一行代码、一分钟部署时间，你就能够搭建出一个自己的域名邮箱。

<img width="1920" height="911" alt="image" src="https://github.com/user-attachments/assets/1b834879-03fa-41c3-8757-f7b86718976a" />

# 如何部署

## 0、检查IP、域名

先去[spamhaus](https://check.spamhaus.org/)检查你的域名和服务器IP是否有屏蔽记录

## 1、下载文件

* [点击这里](https://github.com/Jinnrry/PMail/releases)下载一个与你匹配的程序文件。

## 2、运行

`./pmail -p 80` 

> `-p 指定引导设置界面的http端口，默认为80端口，注意该参数仅影响引导设置阶段，设置完成后如果需要修改端口请修改配置文件`

> [!IMPORTANT]
> 如果引导设置阶段使用非80端口，将无法自动设置SSL证书

> [!IMPORTANT]
> 如果你服务器开启了防火墙，你需要打开25、80、110、443、465、587、995、993端口

## 3、配置

浏览器打开 `http://127.0.0.1` 或者是用你服务器公网IP访问，然后按提示配置

## 4、邮箱得分测试

建议找一下邮箱测试服务(比如[https://www.mail-tester.com/](https://www.mail-tester.com/))进行邮件得分检测，避免自己某些步骤漏配，导致发件进对方垃圾箱。

# 配置文件说明

```jsonc
{
  "logLevel": "info", //日志输出级别
  "domain": "domain.com", // 你的域名
  "webDomain": "mail.domain.com", // web域名
  "dkimPrivateKeyPath": "config/dkim/dkim.priv", // dkim 私钥地址
  "sslType": "0", // ssl证书更新模式，0自动，HTTP模式，1手动、2自动，DNS模式
  "SSLPrivateKeyPath": "config/ssl/private.key", // ssl 证书地址
  "SSLPublicKeyPath": "config/ssl/public.crt", // ssl 证书地址
  "dbDSN": "./config/pmail.db", // 数据库连接DSN
  "dbType": "sqlite", //数据库类型，支持sqlite 和 mysql
  "httpsEnabled": 0, // web后台是否启用https 0默认（启用），1启用，2不启用
  "spamFilterLevel": 0,// 垃圾邮件过滤级别，0不过滤、1 spf dkim 校验均失败时过滤，2 spf校验不通过时过滤
  "httpPort": 80, // http 端口 . 默认 80
  "httpsPort": 443, // https 端口 . 默认 443
  "isInit": true // 为false的时候会进入安装引导流程 
}
```
