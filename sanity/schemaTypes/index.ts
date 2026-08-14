import { type SchemaTypeDefinition } from 'sanity'
import { about } from './about'
import { contatti } from './contatti'
import { galleriaFotografica } from './galleriaFotografica'
import { header } from './header'
import { opera } from './opera'
import { video } from './video'

export const schemaTypes: SchemaTypeDefinition[] = [header, about, opera, galleriaFotografica, video, contatti]
