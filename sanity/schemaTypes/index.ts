import { type SchemaTypeDefinition } from 'sanity'
import { about } from './about'
import { contatti } from './contatti'
import { galleriaFotografica } from './galleriaFotografica'
import { header } from './header'
import { notizia } from './notizia'
import { opera } from './opera'
import { video } from './video'

export const schemaTypes: SchemaTypeDefinition[] = [header, about, opera, galleriaFotografica, notizia, video, contatti]
