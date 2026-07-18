import { NextResponse } from "next/server";
import { blogPosts } from "@/data/blog";

const BASE_URL = "https://codegame.app";

/**
 * RSS 2.0 Feed：为博客文章生成标准 RSS Feed，
 * 支持 RSS 阅读器订阅和自动发现。
 * 路由：/feed.xml
 */
export function GET() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );

  const itemsXml = sortedPosts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${post.author}@codegame.app</author>
      <category>${post.category}</category>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CodeGame 博客</title>
    <link>${BASE_URL}/blog</link>
    <description>CodeGame 产品更新、学习者故事和编程技巧。</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date(sortedPosts[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}