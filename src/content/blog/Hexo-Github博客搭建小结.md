---
author: 浥青城
pubDatetime: 2022-12-27T22:25:51
title: Hexo+Github博客搭建小结
postSlug: Hexo+Github博客搭建小结
featured: false
draft: false
tags:
  - Github
  - Hexo
description: ""
---
时至如今，其实个人博客搭建网上已经有很好的教程了，我也不赘述前人观点了，仅在我发现的大佬[韦阳]("https://godweiyang.com/2018/04/13/hexo-blog/")的一篇十分优秀的博客介绍上稍加补充，这里我主要讲一下博客中“连接GitHub和本地步骤”这一部分的出入：
首先右键打开Git Bash,然后输入下面命令：
``` bash
$ git config --global user.name "ryan6073"
$ git config --global user.email "zhujs5521@mails.jlu.edu.cn"
```
这一步没有任何变化，用户名和邮箱根据GitHub账号信息自行修改即可。
然后下面rsa生成密钥SSH key这里出了问题，原因在于GitHub在2021年11月之后更新了签名算法，并且强制执行。按照原来的步骤执行会出现警告，然后提示要用到ED25519，这一点在GitHub网页端也可以得到印证，根据GitHub的提示，这样来操作即可，这里仍然是在Git Bash里输入命令，如下：
``` bash
$ ssh-keygen -t ed25519 -C "zhujs5521@mails.jlu.edu.cn"
```
然后在GitHub里新建SSH，这里也发生了改变，因为签名算法的改变，key并不能像之前一样写，需要这么输入：
``` bash
$ cat ~/.ssh/id_ed25519.pub
```
复制输出的内容到新建SSH的key框中，名字照常随便取。然后让我们来检验一下就好了：
``` bash
$ ssh -T git@github.com
```
如果出现你的用户名，并且GitHub向你打招呼了，就算成功了。

另外，如果上传博客时出现Git报错：
fatal: unable to access OpenSSL SSL_read: Connection was reset, errno 10054
那么这时应该是因为服务器的SSL证书没有经过第三方机构签署，所以要输入：
``` bash
$ git config --global http.sslVerify “false”
```

参考：
		[韦阳的博客]("https://godweiyang.com/2018/04/13/hexo-blog/")
		[GitHub关于新建SSH的教程]("https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account")