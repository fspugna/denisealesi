'use client'

import {openCookieSettings} from './AnalyticsConsent'

const labels = {it: 'Gestisci cookie', en: 'Cookie settings', es: 'Gestionar cookies'} as const

export function CookieSettingsButton({lang = 'it'}: {lang?: string}) {
  return <button type="button" onClick={openCookieSettings} className="mt-3 text-xs text-white/50 underline underline-offset-4 transition-colors hover:text-white">
    {labels[lang as keyof typeof labels] || labels.it}
  </button>
}
