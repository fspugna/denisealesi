'use client'

import {openCookieSettings} from './AnalyticsConsent'

const labels = {it: 'Gestisci cookie', en: 'Cookie settings', es: 'Gestionar cookies'} as const

export function CookieSettingsButton({lang = 'it', theme = 'dark'}: {lang?: string; theme?: 'dark' | 'light'}) {
  return <button type="button" onClick={openCookieSettings} className={`mt-3 text-xs underline underline-offset-4 transition-colors ${theme === 'light' ? 'text-black/45 hover:text-black' : 'text-white/50 hover:text-white'}`}>
    {labels[lang as keyof typeof labels] || labels.it}
  </button>
}
