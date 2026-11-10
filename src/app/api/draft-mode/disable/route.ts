import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

const validationOrigin = 'https://therancobay.invalid'

function safeReturnPath(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !value.startsWith('/')) return '/'

  try {
    const url = new URL(value, validationOrigin)
    if (url.origin !== validationOrigin) return '/'

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const returnTo = safeReturnPath(formData.get('returnTo'))
  const draft = await draftMode()
  draft.disable()

  const response = NextResponse.redirect(new URL(returnTo, request.url), 303)
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}
