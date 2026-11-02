import sanitizeHtml from 'sanitize-html'
import { Post } from '../models'

// Posts are written as HTML in the database: only keep harmless formatting.
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: ['b', 'strong', 'i', 'em', 'u', 's', 'br', 'p', 'ul', 'ol', 'li', 'a', 'blockquote', 'h3', 'h4'],
  allowedAttributes: { a: ['href', 'target', 'rel'] },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
  },
}

export default defineEventHandler(async () => {
  const posts = await queryDb(() => Post.find(notDeleted).sort({ created_at: -1 }).lean())
  return posts.map((p) => ({
    id: String(p._id),
    title: p.title,
    html: sanitizeHtml(p.text, sanitizeOptions),
    image: p.image || null,
    tags: p.tag ?? [],
    date: p.created_at,
  }))
})
