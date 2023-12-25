---
author: Sat Naing
pubDatetime: 2022-12-28T04:59:04.866Z
title: AstroPaper动态OG图片生成
postSlug: AstroPaper动态OG图片生成
featured: false
draft: false
tags:
  - astro-paper
description: AstroPaper v1.4.0中的新特性，为博客文章引入动态OG图像生成。
---

## Table of contents

## 简介

OG 图片（也称为社交图片）在社交媒体互动中起着重要作用，是我们在社交媒体上分享网站 URL 时显示的图片，例如 Facebook、Discord 等。

AstroPaper 已经提供了一种在博客文章中添加 OG 图片的方式。作者可以在 frontmatter 的 ogImage 中指定 OG 图片。即使作者没有在 frontmatter 中定义 OG 图片，仍会使用默认的 OG 图片作为后备（在这种情况下是 `public/astropaper-og.jpg`）。但问题是默认的 OG 图片是静态的，这意味着每篇不包含在 frontmatter 中的 OG 图片的博客文章将始终使用相同的默认 OG 图片，尽管每篇文章的标题/内容都不同。

## 动态 OG 图片

为每篇文章生成动态 OG 图片使作者无需为每篇博客文章指定 OG 图片。此外，这将防止后备 OG 图像与所有博客文章相同。

在 AstroPaper v1.4.0 中，使用了 Vercel 的 Satori 包进行动态 OG 图片生成。

将在构建时为以下博客文章生成动态 OG 图片：

- frontmatter 中不包含 OG 图片
- 未标记为草稿

## 组成

AstroPaper 的动态 OG 图片包括博客文章的标题、作者姓名和站点标题。作者姓名和站点标题将通过 `src/config.ts` 文件的 SITE.author 和 SITE.title 获取。标题是从博客文章的 frontmatter title 生成的。

## 限制

在撰写本文时，Satori 还相对较新，尚未达到主要发布版本。因此，此动态 OG 图片功能仍然存在一些限制。

- 如果你有具有非英语标题的博客文章，则必须将 embedFonts 选项设置为 false（file：`src/utils/generateOgImage.tsx`）。即使在此之后，OG 图片可能仍然不能很好地显示。
- 此外，RTL 语言尚不受支持。
- 在标题中使用 emoji 可能会有点棘手。
