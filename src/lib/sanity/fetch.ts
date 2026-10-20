import 'server-only'

import {draftMode} from 'next/headers'
import type {QueryParams} from 'next-sanity'

import {sanityClient} from './client'
import {sanityStudioUrl} from './config'
import {getSanityReadToken} from './token'

export type SanityFetchResult<T> =
  | {data: T; status: 'success'}
  | {data: null; status: 'missing' | 'unavailable'}

type FetchOptions = {
  label: string
  params?: QueryParams
  query: string
  revalidate?: number
  tags?: string[]
}

async function fetchWithPerspective<T>(
  options: FetchOptions,
  perspective: 'drafts' | 'published',
): Promise<SanityFetchResult<T>> {
  const token = getSanityReadToken()

  if (!token) {
    return {data: null, status: 'unavailable'}
  }

  const isPreview = perspective === 'drafts'

  try {
    const data = await sanityClient
      .withConfig({
        token,
        perspective,
        useCdn: !isPreview,
        stega: isPreview
          ? {enabled: true, studioUrl: sanityStudioUrl}
          : false,
      })
      .fetch<T>(options.query, options.params ?? {}, {
        cache: isPreview ? 'no-store' : 'force-cache',
        next: isPreview
          ? {revalidate: 0}
          : {
              revalidate: options.revalidate ?? 60,
              tags: options.tags ?? [],
            },
      })

    return data == null
      ? {data: null, status: 'missing'}
      : {data, status: 'success'}
  } catch (error) {
    console.error(
      `[sanity] ${options.label} fetch failed`,
      error instanceof Error ? error.message : 'Unknown error',
    )
    return {data: null, status: 'unavailable'}
  }
}

export function fetchPublishedSanity<T>(options: FetchOptions) {
  return fetchWithPerspective<T>(options, 'published')
}

export async function fetchDraftAwareSanity<T>(options: FetchOptions) {
  const {isEnabled} = await draftMode()
  return fetchWithPerspective<T>(options, isEnabled ? 'drafts' : 'published')
}
