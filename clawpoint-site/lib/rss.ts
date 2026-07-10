interface RssPost {
  title: string
  slug: string
  excerpt: string | null
  created_at: string
}

export function generateRss(posts: RssPost[], siteUrl: string): string {
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt ?? ''}]]></description>
    </item>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Clawpoint Security Collective</title>
    <link>${siteUrl}/blog</link>
    <description>Threat intelligence and cybersecurity insights from Clawpoint Security Collective</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}
