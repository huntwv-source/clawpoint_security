export default function PostBody({ html }: { html: string }) {
  return (
    <div
      className="blog-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
