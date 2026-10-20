import type {LocalGuideEntry} from './types'

export type GuidePracticalLabels = {
  address: string
  directions: string
  telephone: string
  website: string
}

type GuidePracticalInformationProps = {
  entry: LocalGuideEntry
  labels: GuidePracticalLabels
}

export function GuidePracticalInformation({
  entry,
  labels,
}: GuidePracticalInformationProps) {
  const hasLinks = Boolean(
    entry.officialWebsite || entry.mapsUrl || entry.telephoneUrl,
  )

  if (!entry.address && !hasLinks) return null

  return (
    <div className='mt-7 border-t border-[color-mix(in_srgb,var(--trb-sand)_20%,transparent)] pt-5'>
      {entry.address ? (
        <div>
          <p className='text-[0.6875rem] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--trb-sand)_66%,transparent)]'>
            {labels.address}
          </p>
          <p className='mt-2 max-w-md whitespace-pre-line text-sm leading-6 text-[color-mix(in_srgb,var(--trb-sand)_84%,transparent)]'>
            {entry.address}
          </p>
        </div>
      ) : null}

      {hasLinks ? (
        <div className={`${entry.address ? 'mt-4' : ''} flex flex-wrap gap-x-5 gap-y-3 text-sm`}>
          {entry.officialWebsite ? (
            <a
              className='underline decoration-[color-mix(in_srgb,var(--trb-sand)_48%,transparent)] underline-offset-4'
              href={entry.officialWebsite}
              rel='noreferrer'
              target='_blank'
            >
              {labels.website}
            </a>
          ) : null}
          {entry.mapsUrl ? (
            <a
              className='underline decoration-[color-mix(in_srgb,var(--trb-sand)_48%,transparent)] underline-offset-4'
              href={entry.mapsUrl}
              rel='noreferrer'
              target='_blank'
            >
              {labels.directions}
            </a>
          ) : null}
          {entry.telephone && entry.telephoneUrl ? (
            <a
              className='underline decoration-[color-mix(in_srgb,var(--trb-sand)_48%,transparent)] underline-offset-4'
              href={entry.telephoneUrl}
            >
              {labels.telephone}: {entry.telephone}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
