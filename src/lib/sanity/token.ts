import 'server-only'

export function getSanityReadToken() {
  const token = process.env.SANITY_API_READ_TOKEN?.trim()
  return token || null
}
