import { Album } from '../models'

export default defineEventHandler(async () => {
  const albums = await queryDb(() => Album.find(notDeleted).sort({ date: -1 }).lean())
  return albums.map((a) => ({
    id: String(a._id),
    name: a.name,
    date: a.date,
    cover: a.copertina,
    place: a.luogo ?? null,
    placeIG: a.luogoIG ?? null,
    slug: albumSlug(a.photos),
    highQuality: a.highQuality || null,
  }))
})
