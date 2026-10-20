import {stegaClean} from 'next-sanity'

import type {AppLocale} from '@/i18n/routing'
import type {ApartmentId} from '@/features/accommodation/apartments'

import type {
  ApartmentIntroduction,
  ApartmentIntroductionDocument,
  EditorialTextBlock,
} from './types'

function blockKind(style: string | undefined): EditorialTextBlock['kind'] {
  const cleanStyle = stegaClean(style)

  if (cleanStyle === 'blockquote') return 'quote'
  if (cleanStyle?.startsWith('h')) return 'heading'
  return 'paragraph'
}

export function normalizeApartmentIntroduction(
  document: ApartmentIntroductionDocument,
  apartmentId: ApartmentId,
  locale: AppLocale,
): ApartmentIntroduction | null {
  const sourceBlocks = document.introduction?.[locale]
  if (!Array.isArray(sourceBlocks)) return null

  const blocks = sourceBlocks.flatMap((block, index) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return []

    const text = block.children
      .map((child) => (typeof child.text === 'string' ? child.text : ''))
      .join('')
      .trim()

    if (!text) return []

    return [
      {
        key: block._key || `${apartmentId}-${locale}-${index}`,
        kind: blockKind(block.style),
        text,
      },
    ]
  })

  return blocks.length > 0 ? {apartmentId, blocks} : null
}
