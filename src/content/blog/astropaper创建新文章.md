---
author: Sat Naing
pubDatetime: 2022-09-23T04:58:53Z
title: AstroPaper创建新文章
postSlug: AstroPaper创建新文章
featured: false
draft: false
tags:
  - AstroPaper
description: 有关在 AstroPaper 博客主题中创建新文章的规则、技巧和提示
---
## Frontmatter

Frontmatter 是存储有关博客文章（文章）的一些重要信息的主要位置。Frontmatter 位于文章的顶部，采用 YAML 格式编写。在[Astro文档](https://docs.astro.build/en/guides/markdown-content/)中阅读有关 frontmatter 及其用法的更多信息。

以下是每篇文章的 frontmatter 属性列表。

| Property     | Description                                      | Remark                                   |
| ------------ | ------------------------------------------------ | ---------------------------------------- |
| title        | 文章标题（h1）                                   | 必需*                                    |
| description  | 文章描述。在文章摘要和文章站点描述中使用         | 必需*                                    |
| pubDatetime  | 以 ISO 8601 格式发布的日期时间                   | 必需*                                    |
| author       | 文章作者                                         | 默认值 = SITE.author                     |
| postSlug     | 文章的 slug，将自动转换为 slug                   | 默认值 = slugified title                 |
| featured     | 是否在主页的特色部分显示此文章                   | 默认值 = false                           |
| draft        | 将此文章标记为“未发布”                           | 默认值 = false                           |
| tags         | 此文章的相关关键词。以数组 yaml 格式编写         | 默认值 = others                          |
| ogImage      | 文章的 OG 图像。用于社交媒体分享和 SEO           | 默认值 = SITE.ogImage 或生成的 OG 图像   |
| canonicalURL | 规范 URL（绝对路径），以防文章已经存在于其他来源 | 默认值 = Astro.site + Astro.url.pathname |

在 frontmatter 中，只需指定 `title`、`description` 和`pubDatetime` 字段。

对于搜索引擎优化（SEO）而言，title 和 description（摘要）是重要的，因此 AstroPaper 鼓励在博客文章中包含这些信息。

`slug `是 URL 的唯一标识符。因此，slug 必须是唯一的，并且不能与其他文章相同。slug 的空格需要用` - `或 `_ `分隔，但建议使用` -`。但是，即使你没有写正确的 slug，AstroPaper 也会自动将你不正确的 slug 转换为 slug。如果未指定 slug，则将使用文章的 slugified title 作为 slug。

如果在博客文章中省略` tags`（换句话说，如果未指定标签），则将使用默认标签 `others` 作为该文章的标签。可以在 `/src/content/config.ts `文件中设置默认标签。

```typescript
// src/content/config.ts
export const blogSchema = z.object({
  // ...
  draft: z.boolean().optional(),
  tags: z.array(z.string()).default(["others"]), // 用你想要的替换 "others"
  // ...
});
```



## 示例 Frontmatter

以下是文章的示例 frontmatter。

```yaml
# src/content/blog/sample-post.md
---
title: 文章的标题
author: 你的名字
pubDatetime: 2022-09-21T05:17:19Z
postSlug: 文章的标题
featured: true
draft: false
tags:
  - some
  - example
  - tag
ogImage: ""
description: 这是示例文章的示例描述。
canonicalURL: https://example.org/my-article-was-already-posted-here
---
```



## 添加目录

默认情况下，文章不包含任何目录（toc）。要包含目录，必须以特定方式指定。

使用 h2 格式写目录（在 markdown 中为 ##），并将其放在希望它出现在文章中的位置。

例如，如果希望将目录放在介绍段落的下方（就像我通常做的那样），可以按以下方式操作。

```markdown
#  frontmatter
---

以下是在 AstroPaper 博客主题中创建新文章的规则、技巧和提示。

## Table of contents

<!-- 文章的其余部分 -->
```



## 标题

关于标题有一点需要注意。AstroPaper 博客文章使用 title（frontmatter 中的 title）作为文章的主标题。因此，文章中的其余标题应使用 h2 ~ h6。

尽管这不是强制性规定，但基于视觉、可访问性和 SEO 方面的考虑，强烈建议遵循这一规则。



## 博客内容存储图像

有两种方法可以存储图像并在 markdown 文件中显示它们。

**注意！如果要在 markdown 中样式化优化过的图像，应使用 MDX。**

### 在 `src/assets/ `目录内部（推荐）

可以将图像存储在 `src/assets/` 目录内。Astro 通过 Image Service API 会自动对这些图像进行优化。

可以使用相对路径或别名路径（@assets/）来提供这些图像。

例如，假设要显示路径为` /src/assets/images/example.jpg` 的 example.jpg。

```markdown
![something](@assets/images/example.jpg)

<!-- OR -->

![something](../../assets/images/example.jpg)

<!-- 使用 img 标签或 Image 组件将不起作用 ❌ -->
<img src="@assets/images/example.jpg" alt="something">
<!-- ^^ 这是错误的 -->
```

从技术上讲，可以将图像存储在 src 下的任何目录中。在这里，`src/assets` 仅是一个推荐。

### 在 public 目录内部

可以将图像存储在` public` 目录内。请注意，存储在 public 目录中的图像将被 Astro 保持不变，这意味着它们将不会被优化，您需要自行处理图像优化。

对于这些图像，应使用绝对路径；可以使用 markdown 注释或 HTML img 标签显示这些图像。

例如，假设 example.jpg 位于` /public/assets/images/example.jpg`。

```markdown
![something](/assets/images/example.jpg)

<!-- 或者 -->

<img src="/assets/images/example.jpg" alt="something">
```



## 图像压缩

在博客文章中放置图像时（特别是对于 public 目录下的图像），建议对图像进行压缩。这将影响网站的整体性能。

我的图像压缩站点建议：

- [TinyPng](https://tinypng.com/)
- [TinyJPG](https://tinyjpg.com/)



## OG 图像

如果文章未指定 OG 图像，则将放置默认的 OG 图像。虽然不是必需的，但建议在 frontmatter 中指定与文章相关的 OG 图像。OG 图像的推荐尺寸为 1200 x 640 像素。

自 AstroPaper v1.4.0 起，如果未指定，将自动生成 OG 图像，[查看公告](https://astro-paper.pages.dev/posts/dynamic-og-image-generation-in-astropaper-blog-posts/)。

这样，您就可以根据自己的喜好创建新文章，并添加所需的元素。