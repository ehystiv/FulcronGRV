import { Oneshot } from '../models'

export default defineEventHandler(async () => {
  const oneshots = await queryDb(() => Oneshot.find(notDeleted).sort({ date: -1 }).lean())
  return oneshots.map((o) => ({
    id: String(o._id),
    title: o.title,
    date: o.date,
    image: o.img,
    description: o.description ?? '',
    tags: o.type ?? [],
    photos: o.photo || null,
  }))
})
