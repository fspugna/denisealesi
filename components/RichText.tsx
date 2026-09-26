import {PortableText, type PortableTextBlock, type PortableTextComponents} from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="whitespace-pre-line leading-relaxed">{children}</p>,
    h2: ({children}) => <h2 className="pt-3 font-serif text-3xl leading-tight">{children}</h2>,
    h3: ({children}) => <h3 className="pt-2 font-serif text-2xl leading-tight">{children}</h3>,
    blockquote: ({children}) => <blockquote className="border-l border-current/30 pl-5 italic opacity-85">{children}</blockquote>,
  },
  marks: {
    underline: ({children}) => <span className="underline underline-offset-2">{children}</span>,
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const external = href.startsWith('http://') || href.startsWith('https://')
      return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="underline decoration-current/40 underline-offset-4 transition-opacity hover:opacity-65">{children}</a>
    },
  },
  list: {
    bullet: ({children}) => <ul className="ml-6 list-disc space-y-2">{children}</ul>,
    number: ({children}) => <ol className="ml-6 list-decimal space-y-2">{children}</ol>,
  },
}

export default function RichText({value, className = ''}: {value?: PortableTextBlock[]; className?: string}) {
  if (!value?.length) return null

  return <div className={`space-y-5 ${className}`}><PortableText value={value} components={components} /></div>
}
