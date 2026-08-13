import { LocalizedContentTranslation, PortableContentBlock } from '@/types'

type TranslationBase = {
    language?: string | null
}

export function getLocalizedFieldValue<
    TTranslation extends TranslationBase,
    TKey extends Exclude<keyof TTranslation, 'language'>
>(
    translations: TTranslation[] | null | undefined,
    lang: string,
    fieldName: TKey,
    fallbackValue?: TTranslation[TKey] | null
) {
    const safeTranslations = Array.isArray(translations) ? translations : []

    const localizedValue = safeTranslations.find(
        (translation) => translation.language === lang && translation[fieldName] != null
    )?.[fieldName]

    if (localizedValue != null) {
        return localizedValue
    }

    const firstAvailableValue = safeTranslations.find(
        (translation) => translation[fieldName] != null
    )?.[fieldName]

    if (firstAvailableValue != null) {
        return firstAvailableValue
    }

    return fallbackValue ?? undefined
}

export function getLocalizedTitle(
    translations: LocalizedContentTranslation[] | null | undefined,
    lang: string,
    fallbackTitle?: string | null
) {
    return getLocalizedFieldValue(translations, lang, 'titolo', fallbackTitle) || 'Contenuto senza titolo'
}

export function getLocalizedBody(
    translations: LocalizedContentTranslation[] | null | undefined,
    lang: string,
    fallbackContent?: PortableContentBlock[] | null
) {
    return getLocalizedFieldValue(translations, lang, 'contenuto', fallbackContent) || []
}
