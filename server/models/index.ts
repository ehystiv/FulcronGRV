import mongoose, { Schema, type InferSchemaType, type Model } from 'mongoose'

// Schemas match the collections already in production ("albums", "oneshots",
// "posts"), so the existing data keeps working without a migration.

const albumSchema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  copertina: { type: String, required: true },
  luogo: String,
  luogoIG: String,
  // Folder name of the photos, e.g. "/alla-vecchia-spada"
  photos: String,
  highQuality: String,
  deleted: Boolean,
})

const oneshotSchema = new Schema({
  type: [String],
  title: { type: String, required: true },
  date: { type: Date, required: true },
  img: { type: String, required: true },
  description: String,
  photo: String,
  deleted: Boolean,
})

const postSchema = new Schema({
  tag: [String],
  image: { type: String, default: null },
  title: { type: String, required: true },
  text: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  deleted: Boolean,
})

function defineModel<T extends Schema>(name: string, schema: T) {
  // Reuse the compiled model on hot reload
  return (mongoose.models[name] as Model<InferSchemaType<T>>) ?? mongoose.model(name, schema)
}

export const Album = defineModel('album', albumSchema)
export const Oneshot = defineModel('oneshot', oneshotSchema)
export const Post = defineModel('post', postSchema)
