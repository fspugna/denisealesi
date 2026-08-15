import Image from 'next/image'

const badges = {
  it: {src: '/amazon/available-at-amazon-it.png', width: 672, height: 103, alt: 'Disponibile su Amazon'},
  en: {src: '/amazon/available-at-amazon-en.png', width: 635, height: 104, alt: 'Available at Amazon'},
  es: {src: '/amazon/available-at-amazon-es.png', width: 683, height: 103, alt: 'Disponible en Amazon'},
} as const

export default function AmazonBadge({href, lang}: {href: string; lang: string}) {
  const language = lang === 'en' || lang === 'es' ? lang : 'it'
  const badge = badges[language]

  return <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${badge.alt} — apre il sito Amazon`}
    className="inline-flex shrink-0 p-3 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9e835c]"
  >
    <Image
      src={badge.src}
      width={badge.width}
      height={badge.height}
      alt={badge.alt}
      unoptimized
      className="h-auto w-[168px]"
    />
  </a>
}
