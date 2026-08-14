import type {Contatti} from '@/types'

export const fallbackContacts: Contatti = {
  email: 'denise.alesi@alice.it',
  social: [
    {_key: 'facebook', nome: 'Facebook', url: 'https://www.facebook.com/denise.alesi.583'},
    {_key: 'instagram', nome: 'Instagram', url: 'https://www.instagram.com/denise_alesi'},
    {_key: 'youtube', nome: 'YouTube', url: 'https://www.youtube.com/channel/UCMWKycyJwLHJlgrPcHMn6zw/featured'},
  ],
}

export function withContactFallback(contacts: Contatti | null): Contatti {
  return contacts ? {
    ...fallbackContacts,
    ...contacts,
    social: contacts.social?.length ? contacts.social : fallbackContacts.social,
  } : fallbackContacts
}
