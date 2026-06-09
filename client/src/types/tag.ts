import type { Artwork } from './artwork'

export interface Tag {
  id: number,
  name: string,
}

export interface TagDetail extends Tag {
  artworks: Artwork[]
}