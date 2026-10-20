'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

type PreviewExitControlProps = {
  locale: string
}

export function PreviewExitControl({locale}: PreviewExitControlProps) {
  const isPresentationTool = useIsPresentationTool()

  if (isPresentationTool) return null

  return (
    <form
      action='/api/draft-mode/disable'
      method='post'
      className='fixed bottom-5 right-5 z-[90]'
    >
      <input type='hidden' name='returnTo' value={`/${locale}`} />
      <button
        type='submit'
        className='rounded-full border border-page-border bg-page-text-strong px-5 py-3 text-sm font-medium text-page-surface shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-page-focus'
      >
        Exit preview
      </button>
    </form>
  )
}
