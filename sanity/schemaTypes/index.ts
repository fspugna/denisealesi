import { type SchemaTypeDefinition } from 'sanity'
import { about } from './about'
import { contatti } from './contatti'
import { esposizione } from './esposizione'
import { galleria } from './galleria'
import { header } from './header'
import { notizia } from './notizia'
import { opera } from './opera'
import { recensione } from './recensione'
import { video } from './video'

export const schemaTypes: SchemaTypeDefinition[] = [header, about, opera, galleria, recensione, esposizione, notizia, video, contatti]
