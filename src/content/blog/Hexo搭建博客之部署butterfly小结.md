---
author: 浥青城
pubDatetime: 2022-12-29T15:27:51
title: Hexo搭建博客之部署butterfly小结
postSlug: Hexo搭建博客之部署butterfly小结
featured: false
draft: false
tags:
  - Hexo
description: ""
---
更换butterfly主题后报错：extends includes/layout.pug block content #recent-posts.recent-posts include includes/recent-posts.pug include includes/pagination.pug
原因在于butterfly的git仓库很久没更新了，而依赖的组件很多易名或者不支持了，所以需要更新一下，在Git Bash里输入
``` bash
$ npm install --save hexo-renderer-jade hexo-generator-feed hexo-generator-sitemap hexo-browsersync hexo-generator-archive
```
然后会出现很多提醒和报错，按照提示输入：
``` bash
$ npm audit fix
```
之后正常更新一下静态文件重新生成即可。
``` bash
$ hexo clean
$ hexo g
$ hexo s
```
