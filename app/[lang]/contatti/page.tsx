import ContactsView from '@/components/ContactsView'
import {withContactFallback} from '@/lib/contacts'
import {client} from '@/sanity/lib/client'
import type {Contatti} from '@/types'
import {defineQuery} from 'next-sanity'

const CONTACTS_QUERY = defineQuery(`
  *[_id == "contatti"][0]{
    telefono,
    email,
    "fotoUrl": foto.asset->url,
    "fotoAlt": foto.alt,
    social[]{_key, nome, url}
  }
`)

async function getContacts(): Promise<Contatti | null> {
  return client.fetch<Contatti | null>(CONTACTS_QUERY)
}

export default async function ContactsPage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const contacts = withContactFallback(await getContacts())

  return <main className="min-h-screen bg-[#20251f] text-white">
    <ContactsView contattiData={contacts} lang={lang} />
  </main>
}
