import {defineField, defineType, type ObjectRule} from 'sanity'

import {localeIds, supportedLanguages} from '../../lib/locales'

type LocalizedValue = Record<string, unknown> | undefined

function hasContent(value: unknown) {
  if (typeof value === 'string') return value.trim().length > 0
  return Array.isArray(value) && value.length > 0
}

function missingTranslationMessage(value: LocalizedValue) {
  const missing = supportedLanguages.filter(({id}) => !hasContent(value?.[id]))
  return missing.length === 0
    ? true
    : `Aggiungi la traduzione in: ${missing.map(({title}) => title).join(', ')}.`
}

function localizedValidation(level: 'error' | 'warning') {
  return (Rule: ObjectRule) => {
    const validation = Rule.custom(missingTranslationMessage)
    return level === 'warning' ? validation.warning() : validation.error()
  }
}

function localizedType(
  name: string,
  title: string,
  fieldType: 'string' | 'text' | 'array',
  level: 'error' | 'warning',
) {
  const fields = supportedLanguages.map(({id, title: languageTitle}) => {
    if (fieldType === 'array') {
      return defineField({
        name: id,
        title: languageTitle,
        type: 'array',
        of: [{type: 'block'}],
      })
    }

    if (fieldType === 'text') {
      return defineField({
        name: id,
        title: languageTitle,
        type: 'text',
        rows: 5,
      })
    }

    return defineField({name: id, title: languageTitle, type: 'string'})
  })

  return defineType({
    name,
    title,
    type: 'object',
    options: {columns: 1},
    fields,
    validation: localizedValidation(level),
  })
}

export const localizedTypes = [
  localizedType('localeStringRequired', 'Traduzioni', 'string', 'error'),
  localizedType('localeStringRecommended', 'Traduzioni', 'string', 'warning'),
  localizedType('localeTextRequired', 'Traduzioni', 'text', 'error'),
  localizedType('localeTextRecommended', 'Traduzioni', 'text', 'warning'),
  localizedType('localeRichTextRequired', 'Traduzioni', 'array', 'error'),
  localizedType('localeRichTextRecommended', 'Traduzioni', 'array', 'warning'),
]

export const localizedFieldNames = new Set(localeIds)
