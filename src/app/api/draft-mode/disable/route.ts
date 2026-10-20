import {draftMode} from 'next/headers'
import {NextResponse} from 'next/server'

const localePath = /^\/(en|it|de|fr)(?:\/|$)/

function safeReturnPath(value: FormDataEntryValue | null) {
  if (typeof value !== 'string' || !localePath.test(value)) return '/en'
  return value
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
