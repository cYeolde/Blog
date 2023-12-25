import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

//为博客文章创建集合
const blog = defineCollection({
  type: "content",
//通过z函数创建的schema用于规定博客文章的结构
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      title: z.string(),
      postSlug: z.string().optional(),//文章的slug标识符
      featured: z.boolean().optional(),//文章是否为特色文章
      draft: z.boolean().optional(),//文章是否为草稿
      tags: z.array(z.string()).default(["其他"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),//文章的OpenGraph图片
      description: z.string(),
      canonicalURL: z.string().optional(),//规范URL
      readingTime: z.string().optional(),//预计阅读时间 frontmatter
    }),
});

//导出一个单独的‘collections'对象来注册集合
export const collections = { blog };
