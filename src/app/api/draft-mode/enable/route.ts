import {defineEnableDraftMode} from 'next-sanity/draft-mode'

import {sanityClient} from '@/lib/sanity/client'
import {getSanityReadToken} from '@/lib/sanity/token'

export async function GET(request: Request) {
  const token = getSanityReadToken()

  if (!token) {
    return new Response('Sanity preview is not configured.', {
      status: 503,
      headers: {'Cache-Control': 'private, no-store'},
    })
  }

  const handler = defineEnableDraftMode({
    client: sanityClient.withConfig({token, useCdn: false}),
  })
  const response = await handler.GET(request)
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
