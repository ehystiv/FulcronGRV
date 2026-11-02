import mongoose from 'mongoose'

let connection: Promise<typeof mongoose> | null = null

/**
 * Returns a shared mongoose connection, or `null` when no database is
 * configured (NUXT_MONGODB_URI empty). The connection is created lazily on
 * the first request and reused afterwards; a failed attempt is retried on the
 * next request instead of breaking the server forever.
 */
export async function useDb() {
  const { mongodbUri } = useRuntimeConfig()
  if (!mongodbUri) return null

  connection ??= mongoose.connect(mongodbUri, { serverSelectionTimeoutMS: 5000 }).catch((error) => {
    connection = null
    throw error
  })

  return connection
}

/** Documents soft-deleted by the old `mongoose-delete` plugin are hidden. */
export const notDeleted = { deleted: { $ne: true } }

/**
 * Runs a query against the database, turning every failure into a clean
 * HTTP error (internal details are logged, never sent to the browser).
 */
export async function queryDb<T>(run: () => Promise<T>): Promise<T> {
  let db
  try {
    db = await useDb()
  } catch (error) {
    console.error('[db] connessione fallita:', error)
    throw createError({ statusCode: 503, statusMessage: 'Database non disponibile' })
  }
  if (!db) {
    throw createError({ statusCode: 503, statusMessage: 'Database non configurato' })
  }
  try {
    return await run()
  } catch (error) {
    console.error('[db] query fallita:', error)
    throw createError({ statusCode: 500, statusMessage: 'Errore interno' })
  }
}
