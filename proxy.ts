import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

const locales = ['it', 'en', 'es']

const legacyListRedirects: Record<string, string> = {
  '/index.php': '/it',
  '/index_old.php': '/it',
  '/chi_sono.php': '/it/biografia',
  '/chi_sono_old.php': '/it/biografia',
  '/contatti.php': '/it/contatti',
  '/galleria.php': '/it/opere',
  '/galleria_old.php': '/it/opere',
  '/notizie.php': '/it/notizie',
  '/notizie_all.php': '/it/notizie',
  '/recensioni.php': '/it/notizie',
  '/recensioni_all.php': '/it/notizie',
  '/esposizioni.php': '/it/gallerie',
  '/esposizioni_all.php': '/it/gallerie',
  '/video.php': '/it/video',
  '/video_all.php': '/it/video',
}

const legacyDetailTypes: Record<string, {section: string; documentType: string}> = {
  '/notizie.php': {section: 'notizie', documentType: 'notizia'},
}

function permanentRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  return NextResponse.redirect(url, 308)
}

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl

  const oldBiographyRoute = pathname.match(/^\/(it|en|es)\/about\/?$/)
  if (oldBiographyRoute) return permanentRedirect(request, `/${oldBiographyRoute[1]}/biografia`)

  const legacyDestination = legacyListRedirects[pathname.toLowerCase()]
  if (legacyDestination) {
    const legacyId = request.nextUrl.searchParams.get('id')
    const detail = legacyDetailTypes[pathname.toLowerCase()]

    if (detail && legacyId && /^\d+$/.test(legacyId)) {
      return permanentRedirect(
        request,
        `/it/${detail.section}/legacy-${detail.documentType}-${legacyId}`,
      )
    }

    return permanentRedirect(request, legacyDestination)
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return NextResponse.next()

  return permanentRedirect(request, `/it${pathname}`)
}

export const config = {
  // Locale redirects apply only to page routes. Public files (anything with an
  // extension), Next.js internals and API routes must reach the filesystem.
  matcher: [
    '/index.php',
    '/index_old.php',
    '/chi_sono.php',
    '/chi_sono_old.php',
    '/contatti.php',
    '/galleria.php',
    '/galleria_old.php',
    '/notizie.php',
    '/notizie_all.php',
    '/recensioni.php',
    '/recensioni_all.php',
    '/esposizioni.php',
    '/esposizioni_all.php',
    '/video.php',
    '/video_all.php',
    '/((?!api|_next|.*\\..*).*)',
  ],
}
