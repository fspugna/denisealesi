import {permanentRedirect} from 'next/navigation'

export default async function OperePage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  permanentRedirect(`/${lang}/opere-letterarie`)
}
