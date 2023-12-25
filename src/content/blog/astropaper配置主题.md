---
author: Sat Naing
pubDatetime: 2022-09-23T04:58:53Z
title: AstroPaper配置主题
postSlug: AstroPaper配置主题
featured: false
draft: false
tags:
  - AstroPaper
description: 如何配置AstroPaper主题
---
### **配置SITE**

在开发期间，将`SITE.website`留空是可以的。但在生产模式中，应该在`SITE.website`选项中指定您的部署URL，因为这将用于规范URL、社交卡URL等，这对于SEO很重要。

```typescript
// file: src/config.ts
export const SITE = {
  website: "https://astro-paper.pages.dev/",
  author: "Sat Naing",
  desc: "A minimal, responsive and SEO-friendly Astro blog theme.",
  title: "AstroPaper",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};
```

以下是SITE配置选项：

| 选项               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| `website`          | 部署的网站URL。                                              |
| `author`           | 您的姓名。                                                   |
| `desc`             | 您的站点描述。对于SEO和社交媒体分享很有用。                  |
| `title`            | 您的站点名称。                                               |
| `ogImage`          | 站点的默认OG图像，用于社交媒体分享。OG图像可以是外部图像URL，也可以放置在`/public`目录下。 |
| `lightAndDarkMode` | 启用或禁用网站的浅色和深色模式。如果禁用，将使用主要颜色方案。此选项默认启用。 |
| `postPerPage`      | 您可以指定每个帖子页面中显示多少篇文章。例如，如果将`SITE.postPerPage`设置为3，每个页面将只显示3篇文章。 |



### **配置locale**

配置用于构建的默认区域设置（例如，帖子页面中的日期格式）以及在浏览器中进行渲染的区域设置（例如，搜索页面中的日期格式）。

```typescript
// file: src/config.ts
export const LOCALE = ["en-EN"]; // 将其设置为 [] 以使用环境默认值
```



### **配置logo或标题**

在`src/config.ts`文件中指定站点的标题或标志图像。

```typescript
// file: src/config.ts
export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};
```

`LOGO_IMAGE.enable => false`：`SITE.title`转换为主站点文本标志。

`LOGO_IMAGE.enable => true`：使用标志图像作为站点的主标志。

您必须在`/public/assets`目录下指定`logo.png`或`logo.svg`。目前仅支持svg和png图像文件格式。**（重要！logo名称必须为`logo.png`或`logo.svg`）**

如果您的标志图像是png文件格式，您必须将`LOGO_IMAGE.svg => false`。

建议指定标志图像的宽度和高度。可通过设置`LOGO_IMAGE.width`和`LOGO_IMAGE.height`来实现。



### **配置社交链接**

配置自己的社交链接以及其图标。

```typescript
// file: src/config.ts
export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  // 其他社交链接
];
```

您必须将特定的社交链接设置为`active: true`，以便在`hero`和`footer`部分显示您的社交链接。然后，您还必须在`href`属性中指定您的社交链接。

您可以在对象中指定`linkTitle`。悬停在社交图标链接上时，将显示此文本。此外，这将提高可访问性和SEO。AstroPaper提供默认的链接标题值，也可以用自己的文本替换它们。

例如，

```typescript
linkTitle: `${SITE.title} on Twitter`,
```

更改为

```typescript
linkTitle: `Follow ${SITE.title} on Twitter`;
```